import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { vibrate } from '../utils/utils';

const Timer = ({ workMinutes, breakMinutes, longBreakMinutes }) => {
    const [minutes, setMinutes] = useState(workMinutes);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isWorkTime, setIsWorkTime] = useState(true);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);

    // refs для зберігання актуальних значень без перезапуску інтервалу
    const minutesRef = useRef(minutes);
    const secondsRef = useRef(seconds);
    const isWorkRef = useRef(isWorkTime);
    const completedRef = useRef(completedPomodoros);

    // синхронізуємо рефи при зміні state
    useEffect(() => { minutesRef.current = minutes; }, [minutes]);
    useEffect(() => { secondsRef.current = seconds; }, [seconds]);
    useEffect(() => { isWorkRef.current = isWorkTime; }, [isWorkTime]);
    useEffect(() => { completedRef.current = completedPomodoros; }, [completedPomodoros]);

    const resetTimer = () => {
        setIsActive(false);
        setIsWorkTime(true);
        setMinutes(workMinutes);
        setSeconds(0);
        setCompletedPomodoros(0);
    };

    const startTimer = () => setIsActive(true);

    const stopTimer = () => {
        setIsActive(false);
        if (isWorkRef.current) {
            setMinutes(workMinutes);
        } else {
            const next = (completedRef.current % 4 === 0 && completedRef.current > 0) ? longBreakMinutes : breakMinutes;
            setMinutes(next);
        }
        setSeconds(0);
    };

    const handleStartStop = () => { isActive ? stopTimer() : startTimer(); };

    const formatTime = (min, sec) => `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;

    // Основний ефект: запускаємо інтервал лише коли isActive стає true
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                // читаємо актуальні значення з рефів
                if (secondsRef.current === 0) {
                    if (minutesRef.current === 0) {
                        // завершення періоду
                        vibrate();

                        if (isWorkRef.current) {
                            const newCompleted = completedRef.current + 1;
                            setCompletedPomodoros(newCompleted);
                            completedRef.current = newCompleted;
                            setIsWorkTime(false);
                            isWorkRef.current = false;

                            if (newCompleted % 4 === 0) {
                                setMinutes(longBreakMinutes);
                                minutesRef.current = longBreakMinutes;
                            } else {
                                setMinutes(breakMinutes);
                                minutesRef.current = breakMinutes;
                            }
                            setSeconds(0);
                            secondsRef.current = 0;
                        } else {
                            // завершено перерву → працюємо
                            setIsWorkTime(true);
                            isWorkRef.current = true;
                            setMinutes(workMinutes);
                            minutesRef.current = workMinutes;
                            setSeconds(0);
                            secondsRef.current = 0;
                        }
                    } else {
                        // зменшуємо хвилини та ставимо секунди 59
                        const newMin = minutesRef.current - 1;
                        minutesRef.current = newMin;
                        setMinutes(newMin);

                        secondsRef.current = 59;
                        setSeconds(59);
                    }
                } else {
                    const newSec = secondsRef.current - 1;
                    secondsRef.current = newSec;
                    setSeconds(newSec);
                }
            }, 1000);
        }

        return () => { if (interval) clearInterval(interval); };
    }, [isActive, workMinutes, breakMinutes, longBreakMinutes]);

    // Синхронізація при зміні налаштувань, коли таймер не запущений
    useEffect(() => {
        if (!isActive) {
            if (isWorkTime) {
                setMinutes(workMinutes);
                minutesRef.current = workMinutes;
            } else {
                const next = (completedPomodoros % 4 === 0 && completedPomodoros > 0) ? longBreakMinutes : breakMinutes;
                setMinutes(next);
                minutesRef.current = next;
            }
            setSeconds(0);
            secondsRef.current = 0;
        }
    }, [workMinutes, breakMinutes, longBreakMinutes, isActive, isWorkTime, completedPomodoros]);

    const breakType = completedPomodoros % 4 === 0 && completedPomodoros > 0 ? 'довга' : 'коротка';

    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>{formatTime(minutes, seconds)}</Text>

            {isWorkTime ? (
                <Text style={styles.labelText}>Час роботи</Text>
            ) : (
                <Text style={styles.labelText}>{breakType.charAt(0).toUpperCase() + breakType.slice(1)} перерва</Text>
            )}

            <Text style={styles.pomodoroCounter}>Завершено помодоро: {completedPomodoros}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, isActive ? styles.stopButton : styles.startButton]}
                    onPress={handleStartStop}
                >
                    <Text style={styles.buttonText}>{isActive ? 'Стоп' : 'Старт'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.resetButton]}
                    onPress={resetTimer}
                >
                    <Text style={styles.buttonText}>Скинути</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

Timer.propTypes = {
    workMinutes: PropTypes.number.isRequired,
    breakMinutes: PropTypes.number.isRequired,
    longBreakMinutes: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    timerText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    labelText: {
        fontSize: 24,
        color: '#666',
        marginBottom: 10,
    },
    pomodoroCounter: {
        fontSize: 16,
        color: '#888',
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    stopButton: {
        backgroundColor: '#FF9800',
    },
    resetButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Timer;