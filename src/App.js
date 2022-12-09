import './App.css';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTICLE_WIDTH = 40;
const OBSTICLE_GAP = 200;


function App() {

  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obsticleHeight, setObstileHeight] = useState(100);
  const [obsticleLeft, setObsticleLeft] = useState(GAME_WIDTH - OBSTICLE_WIDTH);
  const [score, setScore] = useState(0);

  const bottomObsticleHeight = GAME_HEIGHT - OBSTICLE_GAP - obsticleHeight;

  useEffect(() => {
    let timeId;
    if(gameHasStarted && birdPosition < GAME_HEIGHT-BIRD_SIZE){
      timeId = setInterval(() => {
        setBirdPosition(birdPosition => birdPosition + GRAVITY)
      }, 24)
    }

    return () => {
      clearInterval(timeId);
    }
  }, [birdPosition, gameHasStarted]);

  useEffect(() => {
    let obsticleId;
    if(gameHasStarted && obsticleLeft >= -OBSTICLE_WIDTH){
      obsticleId = setInterval(() => {
        setObsticleLeft((obsticleLeft) => obsticleLeft - 5);
      }, 24);

      return () => {
        clearInterval(obsticleId)
      };

    } else {
      setObsticleLeft(GAME_WIDTH - OBSTICLE_WIDTH);
      setObstileHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTICLE_GAP)));
      setScore(score => score + 1);
    }
  },[gameHasStarted, obsticleLeft]);

  useEffect(() => {
    const hasCollidedWithTopObsticle = birdPosition >=0 && birdPosition < obsticleHeight;
    const hasCollidedWithBottomObsticle = birdPosition <= 500 && birdPosition >= 500 -bottomObsticleHeight;

    if(obsticleLeft >= 0 && obsticleLeft <= OBSTICLE_WIDTH && (hasCollidedWithTopObsticle || hasCollidedWithBottomObsticle)){
      setGameHasStarted(false);
    }

  }, [birdPosition, obsticleHeight, bottomObsticleHeight, obsticleLeft])

 const handleClick= () => {
   let newBirdPosition = birdPosition - JUMP_HEIGHT;
   if(!gameHasStarted){
     setGameHasStarted(true);
   }else if(newBirdPosition < 0) {
    setBirdPosition(0);
   }else {
    setBirdPosition(newBirdPosition);
   }
 }


  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obsticle 
          top = {0}
          width = {OBSTICLE_WIDTH}
          height = {obsticleHeight}
          left = {obsticleLeft}
        />

        <Obsticle 
          top = {GAME_HEIGHT - (obsticleHeight + bottomObsticleHeight)}
          width = {OBSTICLE_WIDTH}
          height = {bottomObsticleHeight}
          left = {obsticleLeft}
        />
        <Bird size={BIRD_SIZE} top = {birdPosition} ></Bird>
      </GameBox>
      <span> {score} </span>
    </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span{
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obsticle = styled.div `
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  left: ${(props) => props.left}px;

`;