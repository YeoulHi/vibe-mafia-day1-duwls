'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Player from './Player';
import Enemy from './Enemy';
import GameUI from './GameUI';

// 게임 상태를 관리하는 인터페이스 (TypeScript 타입 정의)
interface GameState {
  isPlaying: boolean;        // 게임 진행 중 여부
  isGameOver: boolean;       // 게임 종료 여부
  score: number;             // 현재 점수 (생존 시간)
  level: string;             // 현재 레벨
  nextLevel: string;         // 다음 레벨 안내
  enemies: Array<{           // 적(아카이누) 배열
    id: number;
    x: number;
    y: number;
  }>;
  playerPosition: {          // 플레이어(루피) 위치
    x: number;
    y: number;
  };
}

// 레벨 정보를 반환하는 함수 (생존 시간에 따른 레벨 분류)
const getLevelInfo = (time: number) => {
  if (time < 10) return { level: "초보자", next: "10초에 숙련자" };
  if (time < 30) return { level: "숙련자", next: "30초에 마스터" };
  return { level: "마스터", next: "최고 레벨 달성!" };
};

export default function Game() {
  // 게임 상태 관리 (useState 훅 사용)
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    level: "초보자",
    nextLevel: "10초에 숙련자",
    enemies: [],
    playerPosition: { x: 0, y: 0 }
  });

  // 게임 루프와 타이머를 위한 ref (useRef 훅 사용)
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const enemyIdRef = useRef<number>(0);

  // 게임 시작 함수
  const startGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      level: "초보자",
      nextLevel: "10초에 숙련자",
      enemies: [],
      playerPosition: { x: window.innerWidth / 2 - 25, y: window.innerHeight - 100 }
    });
  }, []);

  // 게임 종료 함수
  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, []);

  // 충돌 감지 함수 (플레이어와 적의 충돌 검사)
  const checkCollision = useCallback((player: { x: number; y: number }, enemy: { x: number; y: number }) => {
    const playerSize = 50;  // 플레이어 크기
    const enemySize = 50;   // 적 크기
    
    // AABB 충돌 검사 (Axis-Aligned Bounding Box)
    return (
      player.x < enemy.x + enemySize &&
      player.x + playerSize > enemy.x &&
      player.y < enemy.y + enemySize &&
      player.y + playerSize > enemy.y
    );
  }, []);

  // 키보드 입력 처리 함수
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!gameState.isPlaying) return;

    const moveSpeed = 5;  // 이동 속도
    setGameState(prev => {
      const newPosition = { ...prev.playerPosition };
      
      // WASD 및 방향키 입력 처리
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newPosition.y = Math.max(0, newPosition.y - moveSpeed);
          break;
        case 's':
        case 'arrowdown':
          newPosition.y = Math.min(window.innerHeight - 50, newPosition.y + moveSpeed);
          break;
        case 'a':
        case 'arrowleft':
          newPosition.x = Math.max(0, newPosition.x - moveSpeed);
          break;
        case 'd':
        case 'arrowright':
          newPosition.x = Math.min(window.innerWidth - 50, newPosition.x + moveSpeed);
          break;
      }
      
      return { ...prev, playerPosition: newPosition };
    });
  }, [gameState.isPlaying]);

  // 터치 입력 처리 함수 (모바일 지원)
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!gameState.isPlaying) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    setGameState(prev => ({
      ...prev,
      playerPosition: {
        x: Math.max(0, Math.min(window.innerWidth - 50, touch.clientX - rect.left - 25)),
        y: Math.max(0, Math.min(window.innerHeight - 50, touch.clientY - rect.top - 25))
      }
    }));
  }, [gameState.isPlaying]);

  // 게임 루프 함수 (60fps로 실행)
  const gameLoop = useCallback((currentTime: number) => {
    if (!gameState.isPlaying) return;

    // 프레임 간격 계산 (60fps 유지)
    const deltaTime = currentTime - lastTimeRef.current;
    if (deltaTime < 16.67) {  // 60fps = 16.67ms per frame
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    setGameState(prev => {
      // 점수 증가 (생존 시간)
      const newScore = prev.score + deltaTime / 1000;
      const levelInfo = getLevelInfo(newScore);
      
      // 새로운 적 생성 (랜덤 위치)
      let newEnemies = [...prev.enemies];
      if (Math.random() < 0.02) {  // 2% 확률로 적 생성
        newEnemies.push({
          id: enemyIdRef.current++,
          x: Math.random() * (window.innerWidth - 50),
          y: -50
        });
      }

      // 적 이동 및 제거
      newEnemies = newEnemies
        .map(enemy => ({ ...enemy, y: enemy.y + 2 }))  // 적이 아래로 이동
        .filter(enemy => enemy.y < window.innerHeight + 50);  // 화면 밖으로 나간 적 제거

      // 충돌 검사
      const hasCollision = newEnemies.some(enemy => 
        checkCollision(prev.playerPosition, enemy)
      );

      if (hasCollision) {
        // 충돌 시 게임 종료
        setTimeout(() => {
          setGameState(prevState => ({
            ...prevState,
            isPlaying: false,
            isGameOver: true
          }));
        }, 0);
      }

      return {
        ...prev,
        score: newScore,
        level: levelInfo.level,
        nextLevel: levelInfo.next,
        enemies: newEnemies
      };
    });

    lastTimeRef.current = currentTime;
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, checkCollision]);

  // 컴포넌트 마운트 시 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouchMove);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleTouchMove]);

  // 게임 루프 시작
  useEffect(() => {
    if (gameState.isPlaying) {
      lastTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameLoop]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
      {/* 게임 UI 컴포넌트 */}
      <GameUI 
        score={gameState.score}
        level={gameState.level}
        nextLevel={gameState.nextLevel}
        isGameOver={gameState.isGameOver}
        onStartGame={startGame}
      />
      
      {/* 플레이어 컴포넌트 */}
      {gameState.isPlaying && (
        <Player position={gameState.playerPosition} />
      )}
      
      {/* 적 컴포넌트들 */}
      {gameState.isPlaying && gameState.enemies.map(enemy => (
        <Enemy key={enemy.id} position={{ x: enemy.x, y: enemy.y }} />
      ))}
    </div>
  );
}
