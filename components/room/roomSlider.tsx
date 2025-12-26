import { IImage } from '@/backend/models/room'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'

interface Props {
  images: IImage[]
}

const RoomSlider = ({ images = [] }: Props) => {
  return (
    <Carousel className="w-full max-w-3xl mx-auto">
      <CarouselContent>
        {images?.length > 0 ? (
          images.map((image) => (
            <CarouselItem key={image?.public_id} className="flex justify-center">
              <div className="relative w-full h-[460px]">
                <Image
                  src={image?.url}
                  alt={image?.url || 'Room Image'}
                  fill
                  className="object-cover rounded-xl"
                />
                
              </div>
            </CarouselItem>
          ))
        ) : (
          <CarouselItem>
            <div className="relative w-full h-[460px]">
            
              <Image
                src="/images/default_room_image.jpg"
                alt="Default room image"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default RoomSlider
