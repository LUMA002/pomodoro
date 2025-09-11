import { Vibration } from 'react-native';

export const vibrate = () => {
    //Vibration.vibrate(500);
    Vibration.vibrate([400, 100, 400, 100, 400, 100, 400]);
};