
import Typewriter from "typewriter-effect";

const Announcement = () => {
  return (
    <div className="bg-pink-400 flex items-center justify-center text-pink-100 font-semibold h-auto sm:h-[50px] p-2 sm:p-4">
      <Typewriter
        options={{
          strings: [
            "✨ Welcome to Beauty Bliss – Where Elegance Meets You",
            "Indulge in Luxurious Skincare Crafted for Your Glow",
            "Transform Your Daily Routine into a Spa-Worthy Ritual",
            "Complimentary Shipping on Orders Over $150 – Just for You!",
            "Limited Time Offer: Enjoy 50% OFF on Selected Beauty Essentials",
            "Shop Now & Treat Yourself – You Deserve the Best!",
            "🎄 Special Christmas Gift: Surprise Beauty Bundle Inside!"
          ],
          autoStart: true,
          loop: true,
          delay: 60,
          deleteSpeed: 40,
        }}
      />
    </div>
  );
};

export default Announcement;
