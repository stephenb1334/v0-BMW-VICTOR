/**
 * Utility function to check if camera permissions are granted
 * @returns Promise<boolean> - true if camera permissions are granted, false otherwise
 */
export async function checkCameraPermissions(): Promise<boolean> {
  try {
    // Try to get camera permissions
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })

    // If successful, stop all tracks and return true
    stream.getTracks().forEach((track) => track.stop())
    return true
  } catch (error) {
    console.error("Camera permission check failed:", error)
    return false
  }
}

/**
 * Utility function to request camera permissions with proper error handling
 * @returns Promise<MediaStream | null> - MediaStream if successful, null if failed
 */
export async function requestCameraPermissions(): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    })
    return stream
  } catch (error) {
    console.error("Camera permission request failed:", error)
    return null
  }
}
