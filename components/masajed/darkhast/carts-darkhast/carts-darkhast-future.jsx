import Image from "next/image";

const CartsDarkhastFuture = ({ image, title, id, body }) => {
  return (
    <div className="flex flex-col justify-end gap-4 border rounded-xl overflow-hidden p-4 xl:p-6">
      <div className="flex items-center gap-[18px] lg:gap-5">
        <img
          className="min-w-[68px] lg:min-w-24 rounded-[0.5rem]"
          src={image}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-bold">{title || "بدون نام"}</h2>
          <p className="text-xs text-[#808393] leading-5">{body}</p>
        </div>
      </div>
      {/* <p className="text-xs text-[#808393] leading-5 lg:hidden">
        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.
      </p> */}
    </div>
  );
};

export default CartsDarkhastFuture;
