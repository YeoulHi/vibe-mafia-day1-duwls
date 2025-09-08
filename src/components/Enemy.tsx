'use client';

import Image from 'next/image';

// 적 위치 정보를 받는 props 인터페이스
interface EnemyProps {
  position: {
    x: number;  // X 좌표
    y: number;  // Y 좌표
  };
}

export default function Enemy({ position }: EnemyProps) {
  return (
    <div
      className="absolute z-5"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50px',
        height: '50px'
      }}
    >
      {/* 아카이누 캐릭터 이미지 */}
      <Image
        src="/akainu.png"
        alt="아카이누"
        width={50}
        height={50}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
