import { Player } from '@lottiefiles/react-lottie-player';

const Idle = () => {
  return (
    <div>
      <Player
        src='https://assets9.lottiefiles.com/packages/lf20_yq3qqjh7.json'
        background='transparent'
        speed={1}
        style={{ height: '300px', width: '50vw' }}
        loop
        autoplay
      ></Player>
    </div>
  );
};

export default Idle;
