import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const useDragScroll = (ref, isDraggable) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scrollPos = useRef({ left: 0, top: 0 });

  const handleStart = useCallback(
    (clientX, clientY) => {
      if (!ref.current || !isDraggable) return;

      setIsDragging(true);
      startPos.current = { x: clientX, y: clientY };
      scrollPos.current = {
        left: ref.current.scrollLeft,
        top: ref.current.scrollTop,
      };
      ref.current.style.cursor = "grabbing";
    },
    [ref, isDraggable]
  );

  const handleMove = useCallback(
    (clientX, clientY) => {
      if (!ref.current || !isDragging) return;

      const dx = clientX - startPos.current.x;
      const dy = clientY - startPos.current.y;

      ref.current.scrollLeft = scrollPos.current.left - dx;
      ref.current.scrollTop = scrollPos.current.top - dy;
    },
    [ref, isDragging]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (ref.current && isDraggable) {
      ref.current.style.cursor = "grab";
    } else if (ref.current) {
      ref.current.style.cursor = "default";
    }
  }, [ref, isDraggable]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mouseMove = (e) => handleMove(e.clientX, e.clientY);
    const mouseUp = () => handleEnd();

    if (isDragging) {
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, [isDragging, handleMove, handleEnd, ref]);

  const events = isDraggable
    ? {
        onMouseDown: (e) => handleStart(e.clientX, e.clientY),
        onTouchStart: (e) =>
          handleStart(e.touches[0].clientX, e.touches[0].clientY),
        onTouchMove: (e) =>
          handleMove(e.touches[0].clientX, e.touches[0].clientY),
        onTouchEnd: handleEnd,
      }
    : {};

  return { events, isDragging };
};

const MEDIA_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".mp4",
  ".webm",
  ".ogg",
];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg"];

const isMediaFile = (fileName) => {
  if (!fileName) return false;
  const lowerCaseName = fileName.toLowerCase();
  return MEDIA_EXTENSIONS.some((ext) => lowerCaseName.endsWith(ext));
};

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 5L5 19M5 5L19 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ZoomInIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 20L17 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 8V14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ZoomOutIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 20L17 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3V17M12 17L18 11M12 17L6 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VideoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="#292D32"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.1001 12V10.52C9.1001 8.60999 10.4501 7.83999 12.1001 8.78999L13.3801 9.52999L14.6601 10.27C16.3101 11.22 16.3101 12.78 14.6601 13.73L13.3801 14.47L12.1001 15.21C10.4501 16.16 9.1001 15.38 9.1001 13.48V12Z"
      stroke="#292D32"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MediaModalContent = ({ fileUrl, fileName, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const contentRef = useRef(null);

  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  const isVideo = VIDEO_EXTENSIONS.includes(`.${fileExtension}`);
  const isImage = !isVideo && MEDIA_EXTENSIONS.includes(`.${fileExtension}`);
  const isPdf = fileExtension === "pdf";

  const isDraggable = zoomLevel > 1 && isImage;

  const { events } = useDragScroll(contentRef, isDraggable);

  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.max(1, Math.min(3, prev + delta)));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-7xl max-h-[90vh] w-full h-full p-4 md:p-6 shadow-2xl transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-10 flex space-x-2 rtl:space-x-reverse">
          {isImage && (
            <>
              <button
                onClick={() => handleZoom(0.2)}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-full bg-white/70 hover:bg-white transition text-gray-800 disabled:opacity-50"
              >
                <ZoomInIcon />
              </button>
              <button
                onClick={() => handleZoom(-0.2)}
                disabled={zoomLevel <= 1}
                className="p-2 rounded-full bg-white/70 hover:bg-white transition text-gray-800 disabled:opacity-50"
              >
                <ZoomOutIcon />
              </button>
            </>
          )}
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-white/70 hover:bg-white transition text-gray-800"
          >
            <DownloadIcon />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/70 hover:bg-white transition text-gray-800"
          >
            <CloseIcon />
          </button>
        </div>

        <div
          ref={contentRef}
          {...events}
          className="w-full h-full overflow-scroll"
          style={{
            cursor: isDraggable ? "grab" : "default",
            userSelect: "none",
            WebkitUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              width: isImage && zoomLevel > 1 ? `${zoomLevel * 100}%` : "100%",
              height: isImage && zoomLevel > 1 ? `${zoomLevel * 100}%` : "100%",
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
            {isImage ? (
              <img
                src={fileUrl}
                alt="مشاهده فایل"
                onDragStart={(e) => e.preventDefault()}
                draggable="false"
                className="object-contain w-full h-full"
              />
            ) : isVideo ? (
              <video
                src={fileUrl}
                controls
                className="w-full h-full object-contain"
              />
            ) : isPdf ? (
              <iframe
                src={fileUrl}
                className="w-full h-full"
                style={{ border: "none" }}
                title="PDF Viewer"
              />
            ) : (
              <p className="text-gray-600">
                فرمت فایل پشتیبانی نمی‌شود یا برای نمایش مناسب نیست.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const FileDisplayWithModal = ({ file, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!file || !file.original) return null;

  const fileExtension = file.original.split(".").pop()?.toLowerCase();
  const isVideo = VIDEO_EXTENSIONS.includes(`.${fileExtension}`);
  const isImage = !isVideo && isMediaFile(file.original);
  const isPdf = fileExtension === "pdf";

  // اگر عکس یا ویدئو یا PDF بود، Modal باز می‌شود
  const isMediaOrPdf = isImage || isVideo || isPdf;

  const handleClick = useCallback(
    (e) => {
      if (isMediaOrPdf) {
        e.preventDefault();
        setIsModalOpen(true);
      }
    },
    [isMediaOrPdf]
  );

  const downloadAttr = !isMediaOrPdf
    ? { download: file.original.split("/").pop() || "file" }
    : {};

  const displayIcon = isPdf || isVideo;

  return (
    <>
      <a
        key={index}
        href={file.original}
        rel="noopener noreferrer"
        target={isMediaOrPdf ? "_self" : "_blank"}
        onClick={handleClick}
        {...downloadAttr}
        className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group cursor-pointer"
      >
        {displayIcon ? (
          <>
            {isVideo ? (
              <VideoIcon />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
                <path
                  d="M8 2H17C19 2 20 3 20 5V6.38"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            <p className="text-xs text-gray-700 mt-2 transition-opacity duration-200">
              {isVideo ? "ویدئو" : "PDF"}
            </p>
          </>
        ) : (
          <img
            src={file.original}
            alt={`فایل ${index + 1}`}
            className="w-full h-full object-cover"
          />
        )}
      </a>

      {isModalOpen && isMediaOrPdf && (
        <MediaModalContent
          fileUrl={file.original}
          fileName={file.original}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default FileDisplayWithModal;
