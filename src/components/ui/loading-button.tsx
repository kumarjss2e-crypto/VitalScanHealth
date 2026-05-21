"use client";

import * as React from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      children,
      isLoading,
      isSuccess,
      isError,
      loadingText,
      successText,
      errorText,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || isSuccess || disabled}
        className={cn(
          "relative min-w-[120px] transition-all duration-300",
          isSuccess && "bg-emerald-600 hover:bg-emerald-600 text-white",
          isError && "bg-red-600 hover:bg-red-600 text-white",
          className
        )}
        {...props}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText && <span>{loadingText}</span>}
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {successText && <span>{successText}</span>}
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              {errorText && <span>{errorText}</span>}
            </motion.div>
          ) : (
            <motion.div
              key="children"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
