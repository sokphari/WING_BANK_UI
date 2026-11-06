
export default function HeroSlider({slides, currentSlide, prevSlide, nextSlide, setCurrentSlide}) {
  return (
        <section className="relative w-full">
          <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[440px] overflow-hidden rounded-[20px] sm:rounded-[28px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "translate-x-0"
                    : index < currentSlide
                    ? "-translate-x-full"
                    : "translate-x-full"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5" />

                <div className="absolute inset-0 flex items-center">
                  <div className="ml-[6%] sm:ml-[11%] max-w-[80%] sm:max-w-[500px] text-white">
                    <h2 className="text-[24px] sm:text-[32px] lg:text-[42px] font-bold leading-tight">
                      {slide.title}
                    </h2>
                    <p className="mt-3 sm:mt-[20px] text-[14px] sm:text-[18px] lg:text-[24px] font-medium">
                      {slide.description}
                    </p>
                    <button className="mt-4 sm:mt-[30px] px-[16px] sm:px-[20px] py-[10px] sm:py-[14px] rounded-[12px] sm:rounded-[16px] bg-[#9BD000] hover:bg-[#8ABD00] text-white text-[14px] sm:text-[18px] font-medium transition">
                      {slide.button}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-[14px] top-1/2 -translate-y-1/2 z-30 w-[56px] h-[56px] rounded-full bg-white/50 hover:bg-white/70 flex items-center justify-center transition"
            >
              <span className="text-[38px] text-gray-800 font-light leading-none">&lt;</span>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-[14px] top-1/2 -translate-y-1/2 z-30 w-[56px] h-[56px] rounded-full bg-white/50 hover:bg-white/70 flex items-center justify-center transition"
            >
              <span className="text-[38px] text-gray-800 font-light leading-none">&gt;</span>
            </button>

            <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-[8px]">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-[11px] h-[11px] rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-[#9BD000]" : "bg-gray-500/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
  );
}
