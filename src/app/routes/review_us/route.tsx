import { Form, redirect, useActionData } from "@remix-run/react";
import { Button } from "../../components/Button";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getUserSession } from "../../utils/session.server";
import { createReview, Review } from "../../models/reviews";
import { addReview } from "../../utils/review.server";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { isUserAdmin } from "../../utils/user.server";

interface error {
    invalidComment?: string
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if(!sessionUser){
    return redirect("/")
  }
  const email = sessionUser.email as string
  const isAdmin: boolean = await isUserAdmin(email) as boolean
  if(isAdmin){
    return redirect("/")
  }

  return null
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const error: error = {}
  
    const rating: number = parseInt(formData.get("rating") as string);
    const comment: string = (formData.get("comment") as string).trim();
    console.log(formData.get("rating"));
    console.log(formData.get("comment"));
    if (comment.length === 0){
      error.invalidComment = "Blank comment"
    } else {
      const sessionUser = await getUserSession(request)
      const review: Review = createReview(sessionUser?.email as string,rating, comment)
      await addReview(review, sessionUser?.email as string)
    }
    
    return {
      error: comment.length === 0 ? error : null,
      success: comment.length === 0 ? null : "Review sent successfully"
    }
}

export default function Review_us() {
  const [rating, setRating] = useState(0);
  const actionData = useActionData<typeof action>()
  const invalidComment = actionData?.error?.invalidComment
  const successMessage = actionData?.success

  const handleClick = (index: number) => {
    if (index === rating) {
      setRating(0);
    } else {
      setRating(index);  
    }
  }

  return (
    <div className="font-sans flex flex-col items-center">
      <h1 className="h1 mt-[5vh]">Review Us</h1>
      {/* REVIEW FORM SECTION */}
      <section className="w-full mt-[5vh]">
        <Form method="post" className="flex flex-col ">
          <div className="flex flex-row mt-[2vh] w-full justify-center">
            <div className="flex w-[40vw] justify-around">
              {[...Array(5)].map((_, index) => (
                <FaStar
                key={index}
                size={70}
                color={index < (rating) ? 'gold' : 'lightgray'}
                onClick={() => handleClick(index + 1)}
                style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <input name="rating" type="number" hidden value={rating} />
          </div>

          <div className="mt-[3vh] flex flex-col items-center justify-center">
            <textarea
                name="comment"
                rows={4}
                placeholder="Share your experience"
                className="resize-none flex items-start sm:w-[70vw] lg:w-[50%] border-[0.2vw] border-accent rounded-[1vw] p-4 h-[45vh]"
                required
            ></textarea>
            {invalidComment && (
              <span className="text-red-500 h-[2vh] text-[2vh] sm:w-[70vw] lg:w-[50%]">
                {invalidComment}
              </span>
            )}
            {successMessage && (
              <span className="text-green-500 h-[2vh] text-[2vh] sm:w-[70vw] lg:w-[50%]">
                {successMessage}
              </span>
            )}
          </div>

          <div className="flex w-full justify-center mt-[3vh]">
            <Button type="submit">Send Review</Button>
          </div>
        </Form >
      </section>
    </div>
  )
}