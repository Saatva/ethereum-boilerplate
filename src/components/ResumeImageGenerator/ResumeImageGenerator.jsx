import { useEffect, useRef, useState } from "react";

function ResumeImageGenerator({ startDate, endDate, logoImage }) {
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
    if (canvasContext) {
      const base_image = new Image();
      base_image.src = logoImage;

      base_image.onload = () => {
        const lineHeight = 24;
        const imageMargin = 24;
        const imageBaseWidth = canvasWidth - imageMargin;
        const imageHeight =
          (base_image.height / base_image.width) * imageBaseWidth;
        const imageY = (canvasHeight - lineHeight * 3) / 2 - imageHeight / 2;
        canvasContext.drawImage(
          base_image,
          imageMargin / 2,
          imageY,
          imageBaseWidth,
          imageHeight,
        );

        const datesOffset = 24;
        canvasContext.font = `${lineHeight}px Helvetica`;
        canvasContext.textAlign = "center";

        let x = canvasWidth / 2 - datesOffset;
        let y = canvasHeight - lineHeight * 2;
        canvasContext.fillStyle = "#45bf7a";
        canvasContext.fillText(startDate, x, y);

        y += lineHeight;
        x += 2 * datesOffset;
        canvasContext.fillStyle = "#bf4545";
        canvasContext.fillText(endDate, x, y);

        setCanvasURL(canvas.toDataURL());
      };
    }
  }, [canvasContext, canvas, endDate, startDate, logoImage]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: "none" }}
      />
      <img src={canvasURL} />
    </>
  );
}

export default ResumeImageGenerator;
