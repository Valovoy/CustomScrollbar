import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";

const MIN_SCROLLBAR_HEIGHT = 40;

const CustomScrollbar = ({
  children,
  onScroll,
  scrollbarColor = "white",
  ...props
}) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollbarHeight, setScrollbarHeight] = useState(0);

  const scrollOffset = useRef(new Animated.Value(0)).current;

  const handleScroll = (e) => {
    onScroll && onScroll(e);
  };

  useEffect(() => {
    if (containerHeight && contentHeight) {
      const scrollbarHeightRatio = containerHeight / contentHeight;

      const scrollbarHeight = Math.max(
        scrollbarHeightRatio * containerHeight,
        MIN_SCROLLBAR_HEIGHT
      );

      setScrollbarHeight(scrollbarHeight);
    }
  }, [containerHeight, contentHeight]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(_, height) => {
          setContentHeight(height);
        }}
        onLayout={({
          nativeEvent: {
            layout: { height },
          },
        }) => {
          setContainerHeight(height);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        {...props}
      >
        {children}
      </ScrollView>
      {contentHeight > containerHeight && (
        <Animated.View
          style={[
            styles.scrollbar,
            { backgroundColor: scrollbarColor },
            { height: scrollbarHeight },
            {
              transform: [
                {
                  translateY: scrollOffset.interpolate({
                    inputRange: [0, contentHeight - containerHeight],
                    outputRange: [0, containerHeight - scrollbarHeight],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  scrollbar: {
    position: "absolute",
    top: 0,
    right: 5,
    width: 3,
    borderRadius: 2,
    opacity: 0.5,
  },
});

export default CustomScrollbar;
