import { Button } from "./Button";
import { GridPattern } from "./GridPattern";
import { StarRating } from "./StarRating";

type Props = {};

const Hero = (props: Props) => {
  return (
    <header className="w-full max-w-full overflow-hidden bg-slate-100 lg:bg-transparent">
      <div className="grid grid-cols-1 lg:min-h-screen lg:grid-cols-10 lg:grid-rows-3">
        <div id="tvbox" className="h-full  lg:col-span-4 lg:row-span-4">
          <div className="relative flex items-end py-10  lg:col-span-5 lg:row-span-2">
            <div
              className="absolute -top-20 -bottom-12 left-0 right-1/2 z-10 rounded-br-3xl bg-blue-600
            text-white/20 md:bottom-1/2 md:right-1/4 lg:-inset-y-3 lg:right-[100%] lg:left-[-100vw] lg:-mr-80"
            >
              <GridPattern
                x="100%"
                y="100%"
                patternTransform="translate(112 64)"
              />
            </div>
            <div className="relative z-10 mx-auto flex w-64 rounded-xl bg-slate-600 shadow-xl md:w-80 lg:w-auto">
              <video
                autoPlay
                controls
                muted
                playsInline
                src={"/teaser.mp4"}
                className="aspect-[9/16] w-96 rounded-xl"
              />
            </div>
          </div>
        </div>
        <div id="title" className="overflow-hidden lg:col-span-6 lg:row-span-4">
          <div className="bg-white pt-20 pb-10 lg:col-span-7 lg:pr-6   lg:pl-12 ">
            <div className=" mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:ml-0 lg:px-0 lg:text-left">
              <h1 className="font-display break-words text-5xl font-extrabold text-slate-900 sm:text-6xl">
                Create programmatic videos at scale
              </h1>
              <p className="mt-4 text-3xl text-slate-600">
                Without coding using nothing but{" "}
                <a
                  href="https://airtable.com"
                  rel="noopener"
                  className="underline decoration-blue-600 hover:decoration-blue-500 "
                >
                  Airtable
                </a>{" "}
                and{" "}
                <a
                  href="https://remotion.dev"
                  rel="noopener"
                  className="underline decoration-blue-600 hover:decoration-blue-500"
                >
                  Remotion
                </a>
                .
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button href="#makeVideo" color="blue">
                  Start making video now
                </Button>
                <Button
                  href="https://github.com/gregonarash/rewind-table"
                  variant="outline"
                  color="blue"
                >
                  Visit Github
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-5 lg:row-start-1">
          <div className=" relative py-6 px-4 sm:px-6 lg:col-span-7 lg:pr-0 lg:pb-14 lg:pt-20  lg:pl-12 ">
            <div className="hidden lg:absolute lg:bottom-0 lg:-top-32 lg:right-[-100vw] lg:left-[-100vw] lg:block lg:bg-slate-100" />
            <Testimonial />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;

function Testimonial() {
  return (
    <figure className="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left">
      <div className="flex justify-center text-blue-600 lg:justify-start">
        <StarRating />
      </div>
      <blockquote className="mt-2">
        <p className="font-display text-xl font-medium text-slate-900">
          “Toto, I've a feeling we're not in Kansas anymore.”
        </p>
      </blockquote>
      <figcaption className="mt-2 text-sm text-slate-500">
        <strong className="font-semibold text-blue-600 before:content-['—_']">
          Dorothy G.
        </strong>
        , Vintage Metaverse Enthusiast
      </figcaption>
    </figure>
  );
}
