import { Player } from '@lottiefiles/react-lottie-player';

const NotFound = () => {
  return (
    <div>
      <Player
        src='https://assets6.lottiefiles.com/packages/lf20_kjixtysj.json'
        background='transparent'
        speed={1}
        style={{ height: '300px', width: '50vw' }}
        loop
        autoplay
      ></Player>
    </div>
  );
};

export default NotFound;
