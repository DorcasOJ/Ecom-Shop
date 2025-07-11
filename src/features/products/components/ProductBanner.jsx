import { useTheme } from "@emotion/react";
import { FullscreenExitSharp } from "@mui/icons-material";
import { Box, MobileStepper } from "@mui/material";
import { useEffect, useState } from "react";
// import { autoPlay } from "react-swipeable-views-utils";
// import SwipeableViews from "react-swipeable-views";
import { useSwipeable } from "react-swipeable";

export const ProductBanner = ({ images }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % images.length);
  };
  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + images.length) % images.length
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleBack,
    trackMouse: true,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  });
  // console.log(activeStep, "step here");

  // or autoplay every 3 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        {...handlers}
        style={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          margin: "auto",
          position: "relative",
          borderRadius: "10px",
          // boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          touchAction: "pan-y",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: `translateX(-${activeStep * 25}%)`,
            transition: "transform 0.7s ease",
            width: `${images.length * 100}%`,
          }}
        >
          {images.map((image, index) => (
            <div key={index} style={{ width: "100%", height: "100%" }}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component={"img"}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                    height: "100%",
                    flexShrink: "0",
                  }}
                  alt={`Slide ${index + 1}`}
                  src={image}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div style={{ alignSelf: "center" }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
        />
      </div>
    </>
  );
};
