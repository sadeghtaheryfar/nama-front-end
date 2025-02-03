import Image from "next/image";

const CartsDarkhastFuture = ({ image, title, id, body }) => {
  return (
    <div className="flex flex-col justify-end gap-4 border rounded-xl p-4 xl:p-6">
      <div className="flex items-center gap-[18px] lg:gap-5">
        <img
          className="min-w-[68px] lg:min-w-24"
          src={image}
          style={{ width: "200px", height: "100px", objectFit: "cover" }}
        />
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-bold">{title || "بدون نام"}</h2>
          <span className="text-xs font-medium lg:text-base">شماره: {id || 0}</span>
          <p className="hidden lg:block text-xs text-[#808393] leading-5">{body}</p>
        </div>
      </div>
      {/* <p className="text-xs text-[#808393] leading-5 lg:hidden">
        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.
      </p> */}
    </div>
  );
};

export default CartsDarkhastFuture;
