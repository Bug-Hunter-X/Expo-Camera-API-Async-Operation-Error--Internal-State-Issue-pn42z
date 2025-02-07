The core issue is a race condition between the camera initialization and attempts to access its properties.  We'll use `useEffect` with a cleanup function to ensure that camera operations only occur when the camera is ready and are stopped when the component unmounts.

```javascript
import * as React from 'react';
import { Camera, CameraType } from 'expo-camera';

const CameraComponent = () => {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [type, setType] = React.useState(CameraType.back);
  const [cameraReady, setCameraReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => {
      // Cleanup - important for preventing errors on unmount
    };
  }, []);

  const handleCameraReady = () => {
    setCameraReady(true);
  };

  const takePicture = async () => {
    if (!cameraReady) return;
    if (hasPermission) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log('photo', photo);
    }
  };

  const cameraRef = React.useRef(null);

  if (hasPermission === null) {
    return <View />;  // or a loading indicator
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={cameraRef}
        onCameraReady={handleCameraReady}
      />
      <Button title="Take Picture" onPress={takePicture} />
    </View>
  );
};

export default CameraComponent;
```