import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LEARNING_MODULES } from '../utils/learningContent';
import { Colors } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { AdUnits } from '../constants/adUnits';
import { Platform } from 'react-native';

// Dynamically import AdMob only for native platforms
let RewardedAd: any = null;
let RewardedAdEventType: any = null;
let TestIds: any = null;

if (Platform.OS !== 'web') {
  const admob = require('react-native-google-mobile-ads');
  RewardedAd = admob.RewardedAd;
  RewardedAdEventType = admob.RewardedAdEventType;
  TestIds = admob.TestIds;
}

const rewardedAd = Platform.OS !== 'web' && RewardedAd
  ? RewardedAd.createForAdRequest(
      __DEV__ ? TestIds.REWARDED : AdUnits.rewarded,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    )
  : null;

export const LearningHubScreen: React.FC = () => {
  const { learningProgress, markLessonComplete } = useApp();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);

  React.useEffect(() => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setRewardedAdLoaded(true);
      }
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        // User earned reward, unlock next lesson
        if (selectedModule) {
          const module = LEARNING_MODULES.find((m) => m.id === selectedModule);
          if (module && selectedLesson < module.lessons.length - 1) {
            setSelectedLesson(selectedLesson + 1);
          }
        }
      }
    );

    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [selectedModule, selectedLesson]);

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setSelectedLesson(0);
  };

  const handleLessonComplete = async (moduleId: string, lessonId: string) => {
    await markLessonComplete(moduleId, lessonId);
    Alert.alert('Great!', 'Lesson marked as complete!');
  };

  const handleNextLesson = () => {
    const module = LEARNING_MODULES.find((m) => m.id === selectedModule);
    if (!module) return;

    if (selectedLesson < module.lessons.length - 1) {
      // Show rewarded ad before unlocking next lesson
      if (rewardedAdLoaded) {
        Alert.alert(
          'Watch Ad to Continue',
          'Watch a short video to unlock the next lesson',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Watch Ad',
              onPress: () => {
                rewardedAd.show();
              },
            },
          ]
        );
      } else {
        // If ad not loaded, allow anyway (for better UX)
        setSelectedLesson(selectedLesson + 1);
      }
    } else {
      Alert.alert('Module Complete!', 'You have completed all lessons in this module!');
    }
  };

  const isLessonComplete = (moduleId: string, lessonId: string) => {
    return learningProgress[moduleId]?.[lessonId] || false;
  };

  const getModuleProgress = (moduleId: string) => {
    const module = LEARNING_MODULES.find((m) => m.id === moduleId);
    if (!module) return 0;

    const completedLessons = module.lessons.filter((lesson) =>
      isLessonComplete(moduleId, lesson.id)
    ).length;

    return (completedLessons / module.lessons.length) * 100;
  };

  if (selectedModule) {
    const module = LEARNING_MODULES.find((m) => m.id === selectedModule);
    if (!module) return null;

    const currentLesson = module.lessons[selectedLesson];

    return (
      <View style={styles.container}>
        <View style={styles.lessonHeader}>
          <TouchableOpacity
            onPress={() => setSelectedModule(null)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.lessonHeaderText}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.lessonTitle}>
              Lesson {selectedLesson + 1} of {module.lessons.length}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.lessonContent}>
          <Text style={styles.lessonHeading}>{currentLesson.title}</Text>
          <Text style={styles.lessonDescription}>{currentLesson.content}</Text>

          <View style={styles.tipsSection}>
            <Text style={styles.tipsHeading}>Key Points:</Text>
            {currentLesson.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet}>
                  <Text style={styles.tipNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionsContainer}>
            {!isLessonComplete(selectedModule, currentLesson.id) && (
              <Button
                mode="contained"
                onPress={() => handleLessonComplete(selectedModule, currentLesson.id)}
                style={styles.completeButton}
                buttonColor={Colors.success}
                contentStyle={styles.buttonContent}
                icon="check"
              >
                Mark as Complete
              </Button>
            )}

            {isLessonComplete(selectedModule, currentLesson.id) && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                <Text style={styles.completedText}>Completed!</Text>
              </View>
            )}

            {selectedLesson < module.lessons.length - 1 && (
              <Button
                mode="contained"
                onPress={handleNextLesson}
                style={styles.nextButton}
                buttonColor={Colors.secondary}
                contentStyle={styles.buttonContent}
                icon="arrow-right"
              >
                Next Lesson
              </Button>
            )}

            {selectedLesson === module.lessons.length - 1 && (
              <Button
                mode="outlined"
                onPress={() => setSelectedModule(null)}
                style={styles.backToModulesButton}
                contentStyle={styles.buttonContent}
              >
                Back to All Modules
              </Button>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={40} color={Colors.primary} />
        <Text style={styles.headerTitle}>Learning Hub</Text>
        <Text style={styles.headerSubtitle}>
          Learn essential farming knowledge
        </Text>
      </View>

      <View style={styles.modulesContainer}>
        {LEARNING_MODULES.map((module) => {
          const progress = getModuleProgress(module.id);
          const completedLessons = module.lessons.filter((lesson) =>
            isLessonComplete(module.id, lesson.id)
          ).length;

          return (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => handleModuleSelect(module.id)}
            >
              <View style={styles.moduleIconContainer}>
                <MaterialCommunityIcons
                  name={module.icon as any}
                  size={32}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleCardTitle}>{module.title}</Text>
                <Text style={styles.lessonCount}>
                  {module.lessons.length} lessons
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {completedLessons}/{module.lessons.length}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color={Colors.info} />
        <Text style={styles.infoText}>
          Complete lessons to unlock the next one. Watch short videos to support
          free education for farmers!
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  modulesContainer: {
    padding: 20,
  },
  moduleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  lessonCount: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  lessonHeaderText: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  lessonTitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  lessonContent: {
    flex: 1,
    padding: 20,
  },
  lessonHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  lessonDescription: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  tipsSection: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 16,
  },
  completeButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  nextButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  backToModulesButton: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  completedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.success,
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
