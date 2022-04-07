import { forwardRef, useEffect, useRef, useState } from "react";

const ResumeImageGenerator = forwardRef(function ResumeImageGenerator(
  { title, startDate, endDate, logoImage, imageId, imageStyle },
  imageRef,
) {
  console.log(`Building Resume Image for ${startDate} - ${endDate}`);

  const [canvas, setCanvas] = useState(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const [canvasURL, setCanvasURL] = useState(null);
  const canvasRef = useRef(null);

  const canvasWidth = 238;
  const canvasHeight = 300;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setCanvas(canvas);
    setCanvasContext(context);
  }, []);

  useEffect(() => {
    if (canvasContext && logoImage) {
      const base_image = new Image();
      base_image.src = URL.createObjectURL(logoImage);
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      base_image.onload = () => {
        console.log(base_image.height);
        const lineHeight = 20;
        const baseFont = `${lineHeight}px Helvetica`;
        const imageMargin = 24;
        const imageBaseWidth = canvasWidth - imageMargin;
        const imageHeight =
          (base_image.height / base_image.width) * imageBaseWidth;
        const imageY = (canvasHeight - lineHeight * 4) / 2 - imageHeight / 2;
        canvasContext.drawImage(
          base_image,
          imageMargin / 2,
          imageY,
          imageBaseWidth,
          imageHeight,
        );

        const datesOffset = 0;
        canvasContext.font = baseFont;
        canvasContext.textAlign = "center";

        let x = canvasWidth / 2;
        let y = canvasHeight - lineHeight * 3 - 10;
        canvasContext.fillStyle = "#444";
        canvasContext.fillText(title, x, y);

        canvasContext.font = `italic 18px Helvetica`;
        x = canvasWidth / 2 - datesOffset;
        y = canvasHeight - lineHeight * 2;
        canvasContext.fillStyle = "#45bf7a";
        canvasContext.fillText(startDate, x, y);

        y += lineHeight;
        x += 2 * datesOffset;
        canvasContext.fillStyle = "#bf4545";
        canvasContext.fillText(endDate, x, y);

        setCanvasURL(canvas.toDataURL());
        URL.revokeObjectURL(base_image.src);
      };
    }
  }, [canvasContext, canvas, endDate, startDate, title, logoImage]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: "none" }}
      />
      <img src={canvasURL} id={imageId} ref={imageRef} style={imageStyle} />
    </>
  );
});

export default ResumeImageGenerator;
