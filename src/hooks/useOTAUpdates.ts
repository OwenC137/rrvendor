import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';

export function useOTAUpdates() {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Check for updates on mount
  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Solo funciona en builds, no en development (Expo Go)
      if (Updates.isEnabled) {
        setIsChecking(true);
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setUpdateAvailable(true);
          await downloadAndApplyUpdate();
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const downloadAndApplyUpdate = async () => {
    try {
      setIsDownloading(true);
      await Updates.fetchUpdateAsync();

      // Reload app to apply update
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error downloading update:', error);
      setIsDownloading(false);
    }
  };

  const manualCheckForUpdates = async () => {
    await checkForUpdates();
  };

  return {
    isChecking,
    isDownloading,
    updateAvailable,
    checkForUpdates: manualCheckForUpdates,
  };
}
