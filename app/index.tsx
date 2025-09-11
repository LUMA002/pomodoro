import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Timer from '../components/timer';
import Settings from '../components/settings';

export default function Index() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(20);

  const scrollViewRef = useRef<ScrollView>(null);


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }} // займи весь доступний розмір
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            // автоматична прокрутка вниз при відкритті клавіатури
            // додана затримка (костиль), щоб дочекатися завершення анімації клавіатури (класичний баг зі слів ШІ)
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 20);
          }}>
            

          <View style={styles.header}>
            <Text style={styles.title}>Фокусуйтеся та будьте продуктивними</Text>
          </View>

          <Timer
            workMinutes={workMinutes}
            breakMinutes={breakMinutes}
            longBreakMinutes={longBreakMinutes}
          />

          <Settings
            workMinutes={workMinutes}
            breakMinutes={breakMinutes}
            longBreakMinutes={longBreakMinutes}
            onWorkMinutesChange={setWorkMinutes}
            onBreakMinutesChange={setBreakMinutes}
            onLongBreakMinutesChange={setLongBreakMinutes}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

});