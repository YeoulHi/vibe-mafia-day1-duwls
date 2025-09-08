import Game from '@/components/Game';

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden">
      {/* 루피 vs 아카이누 피하기 게임 */}
      <Game />
    </div>
  );
}
