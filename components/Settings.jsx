import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Settings = ({
    workMinutes,
    breakMinutes,
    longBreakMinutes,
    onWorkMinutesChange,
    onBreakMinutesChange,
    onLongBreakMinutesChange
}) => {
    const validateInput = (text, onChange) => {
        const cleanedText = text.replace(/[^0-9]/g, '');
        if (cleanedText.length > 3) {
            return;
        }

        const value = parseInt(cleanedText, 10) || 0;

        // мін. 1 хвилина 
        const finalValue = cleanedText ? Math.max(1, value) : value;

        onChange(finalValue);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Налаштування таймера</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Хвилин роботи:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={workMinutes.toString()}
                    onChangeText={(text) => validateInput(text, onWorkMinutesChange)}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Коротка перерва:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={breakMinutes.toString()}
                    onChangeText={(text) => validateInput(text, onBreakMinutesChange)}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Довга перерва:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={longBreakMinutes.toString()}
                    onChangeText={(text) => validateInput(text, onLongBreakMinutesChange)}
                    maxLength={3}
                />
            </View>

            <Text style={styles.helpText}>
                Після кожного 4-ого помодоро буде автоматично застосована довга перерва
            </Text>
        </View>
    );
};

Settings.propTypes = {
    workMinutes: PropTypes.number.isRequired,
    breakMinutes: PropTypes.number.isRequired,
    longBreakMinutes: PropTypes.number.isRequired,
    onWorkMinutesChange: PropTypes.func.isRequired,
    onBreakMinutesChange: PropTypes.func.isRequired,
    onLongBreakMinutesChange: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginVertical: 20,
        width: '90%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        width: 100,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: 'white',
    },
    helpText: {
        fontSize: 14,
        color: '#888',
        marginTop: 15,
        textAlign: 'center',
        fontStyle: 'italic'
    }
});

export default Settings;