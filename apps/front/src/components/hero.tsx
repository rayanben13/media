import Image from "next/image";

export default function Hero() {
  return (
    <div className="bg-primary">
      <div className="container mx-auto  px-4 flex flex-col md:flex-row items-center justify-between gap-8 py-16">
        {/* قسم النص */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Welcome to Media App
          </h1>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores quo
            consequuntur, facere praesentium odit iste expedita qui libero dicta
            ullam.
          </p>
          <button className="mt-8 px-6 py-3 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary/90 transition">
            Get Started
          </button>
        </div>

        {/* قسم الصورة */}
        <div className=" w-sm md:w-1/2 flex justify-center md:justify-end">
          <Image
            src="/images/images.jpg"
            alt="Media App Illustration"
            className="w-full max-w-md h-auto rounded-xl shadow-2xl"
            width={0}
            height={0}
          />
        </div>
      </div>
      <div className="relative bg-primary">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M0,0 C600,120 600,0 1200,120 L1200,0 L0,0 Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
