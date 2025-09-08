'use client';

// 게임 UI props 인터페이스
interface GameUIProps {
  score: number;           // 현재 점수
  level: string;           // 현재 레벨
  nextLevel: string;       // 다음 레벨 안내
  isGameOver: boolean;     // 게임 종료 여부
  onStartGame: () => void; // 게임 시작 함수
}

export default function GameUI({ score, level, nextLevel, isGameOver, onStartGame }: GameUIProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* 게임 시작 화면 */}
      {!isGameOver && score === 0 && (
        <div className="flex items-center justify-center h-full pointer-events-auto">
          <div className="bg-black/80 text-white p-8 rounded-lg text-center max-w-md mx-4">
            <h1 className="text-3xl font-bold mb-4 text-yellow-400">루피 vs 아카이누</h1>
            <p className="text-lg mb-6">아카이누를 피해서 살아남으세요!</p>
            <div className="space-y-2 text-sm mb-6">
              <p><strong>조작법:</strong></p>
              <p>• 데스크탑: WASD 또는 방향키</p>
              <p>• 모바일: 화면을 터치해서 이동</p>
            </div>
            <button
              onClick={onStartGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              게임 시작
            </button>
          </div>
        </div>
      )}

      {/* 게임 진행 중 UI */}
      {score > 0 && !isGameOver && (
        <div className="p-4 space-y-2">
          {/* 점수 표시 */}
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg inline-block">
            <span className="text-yellow-400 font-bold">점수: </span>
            <span className="text-white">{Math.floor(score)}초</span>
          </div>
          
          {/* 레벨 표시 */}
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg inline-block ml-2">
            <span className="text-green-400 font-bold">레벨: </span>
            <span className="text-white">{level}</span>
          </div>
          
          {/* 다음 레벨 안내 */}
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg inline-block ml-2">
            <span className="text-blue-400 font-bold">다음: </span>
            <span className="text-white text-sm">{nextLevel}</span>
          </div>
        </div>
      )}

      {/* 게임 오버 화면 */}
      {isGameOver && (
        <div className="flex items-center justify-center h-full pointer-events-auto">
          <div className="bg-black/90 text-white p-8 rounded-lg text-center max-w-md mx-4">
            <h2 className="text-3xl font-bold mb-4 text-red-400">게임 오버!</h2>
            <div className="space-y-3 mb-6">
              <p className="text-xl">
                <span className="text-yellow-400">최종 점수: </span>
                <span className="text-white font-bold">{Math.floor(score)}초</span>
              </p>
              <p className="text-lg">
                <span className="text-green-400">달성 레벨: </span>
                <span className="text-white font-bold">{level}</span>
              </p>
            </div>
            <button
              onClick={onStartGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              다시 시작
            </button>
          </div>
        </div>
      )}

      {/* 모바일 조작 안내 */}
      <div className="absolute bottom-4 left-4 right-4 md:hidden">
        <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-center text-sm">
          화면을 터치해서 루피를 움직이세요
        </div>
      </div>
    </div>
  );
}
