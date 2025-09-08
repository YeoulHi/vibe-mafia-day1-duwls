'use client';

import Image from 'next/image';

// 플레이어 위치 정보를 받는 props 인터페이스
interface PlayerProps {
  position: {
    x: number;  // X 좌표
    y: number;  // Y 좌표
  };
}

export default function Player({ position }: PlayerProps) {
  return (
    <div
      className="absolute transition-all duration-75 ease-out z-10"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50px',
        height: '50px'
      }}
    >
      {/* 루피 캐릭터 이미지 */}
      <Image
        src="/luffy.png"
        alt="루피"
        width={50}
        height={50}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
