import Image from "next/image";
import Link from "next/link";

const Modal = ({ show, setShow }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black bg-opacity-30 ${
        show ? "block" : "hidden"
      }`}
    >
      {/* محتوای مدال */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* هدر مدال با دکمه بستن */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">عنوان مدال</h2>
          <button onClick={() => setShow(false)} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* بدنه مدال */}
        <div className="p-4">
          <Image
            src="/Images/masajed/darkhast/sabt/sabt1/emza.svg"
            alt="امضا"
            width={500}
            height={300}
            className="w-full h-auto rounded-lg"
          />
          {/* <p className="mt-4 text-gray-700">
            این یک محتوای نمونه برای مدال است. اگر محتوا زیاد باشد، این بخش اسکرول می‌شود.
          </p> */}
        </div>

        {/* فوتر مدال (اختیاری) */}
        <div className="p-4 border-t">
          <Link href="/masajed/darkhast/sabt/sabt1/sabt2/sabt3">
            <button
              onClick={() => setShow(false)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              تایید نهایی
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Modal;
