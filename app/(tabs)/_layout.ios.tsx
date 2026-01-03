
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="discover" name="discover">
        <Icon sf="heart.fill" />
        <Label>Discover</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="conversations" name="conversations">
        <Icon sf="message.fill" />
        <Label>Conversations</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
