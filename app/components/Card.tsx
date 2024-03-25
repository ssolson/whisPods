import Image, { StaticImageData } from 'next/image';
import image from '@/app/assets/the-daily-gwei.jpg';

interface CardProps {
  cardTitle: string;
  cardSubTitle?: string[];
  cardSubTitle2?: string[];
  cardBody?: string;
  topBarColor?: string;
  backgroundColor?: string;
  imageHref?: string | StaticImageData;
  cardButton?: any;
  cardButton2?: any;
  cardFooter?: any;
}

export default function Card({
  topBarColor,
  backgroundColor,
  imageHref,
  cardTitle,
  cardSubTitle,
  cardSubTitle2,
  cardBody,
  cardButton,
  cardButton2,
  cardFooter,
}: CardProps) {
  return (
    <section
      style={{
        backgroundImage: `url(${image.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={`shadow-shadow group flex h-[350px] w-[350px] flex-col justify-end rounded-xl shadow-md duration-300 sm:h-[450px] sm:w-[450px] md:max-w-xl xl:hover:scale-105`}
    >
      <div className="z-10 flex h-full w-full flex-col justify-between border border-white border-opacity-30 bg-black bg-opacity-[92%] opacity-0 duration-300 group-hover:opacity-100 md:p-6">
        <div className="p-4 py-1 md:w-full md:pl-2">
          <label className="text-3xl font-bold">{cardTitle}</label>
          {cardSubTitle && (
            <div className="mt-1 flex gap-2 text-sm text-baseText1">
              {cardSubTitle.map((cat, i) => (
                <p>
                  {cat}
                  <span>{i < cardSubTitle.length - 1 && ','}</span>
                </p>
              ))}
            </div>
          )}

          {cardBody && <p className="mt-6 text-sm font-normal">{cardBody}</p>}
          {cardButton && (
            <div className="mt-6 flex gap-4">
              {cardButton}
              {cardButton2}
            </div>
          )}
        </div>
        <div className="flex w-full justify-between">
          {cardSubTitle2 && (
            <div className="flex gap-2 text-sm text-baseText1">
              {cardSubTitle2.map((cat, i) => (
                <p>
                  {cat}
                  <span>{i < cardSubTitle2.length - 1 && ','}</span>
                </p>
              ))}
            </div>
          )}
          {cardFooter && <div className="flex">{cardFooter}</div>}
        </div>
      </div>
    </section>
  );
}
