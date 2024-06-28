import { forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
    return (
        <button
        {...props}
        ref={ref}
        className="flex w-[30vw] h-[5vh] md:h-[8vh] justify-center items-center rounded-lg btn btn-accent text-[2vw] font-semibold leading-6 text-white shadow-sm"
        />
  );
});

Button.displayName = 'Button';