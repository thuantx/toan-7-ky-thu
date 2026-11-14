export interface BuiltinAvatarOption {
  id: 'pipo_owl' | 'lion' | 'rabbit' | 'dolphin' | 'penguin';
  label: string;
  emoji: string;
}

export const BUILTIN_AVATAR_OPTIONS: BuiltinAvatarOption[] = [
  { id: 'pipo_owl', label: 'Cú Pipo', emoji: '🦉' },
  { id: 'lion', label: 'Sư Tử', emoji: '🦁' },
  { id: 'rabbit', label: 'Thỏ Nhanh', emoji: '🐰' },
  { id: 'dolphin', label: 'Cá Heo', emoji: '🐬' },
  { id: 'penguin', label: 'Cánh Cụt', emoji: '🐧' },
];

export const AVATAR_EMOJI_MAP: Record<string, string> = {
  pipo_owl: '🦉',
  lion: '🦁',
  rabbit: '🐰',
  dolphin: '🐬',
  penguin: '🐧',
};

export const MAX_AVATAR_DATA_URL_LENGTH = 50000;
const SAFE_DATA_IMAGE_REGEX = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

export function isCustomImageAvatar(avatar?: string | null): avatar is string {
  return (
    typeof avatar === 'string' &&
    avatar.length <= MAX_AVATAR_DATA_URL_LENGTH &&
    SAFE_DATA_IMAGE_REGEX.test(avatar)
  );
}

export function sanitizeAvatarValue(avatar?: string | null): string {
  if (typeof avatar !== 'string') return 'pipo_owl';
  const trimmed = avatar.trim();
  if (trimmed in AVATAR_EMOJI_MAP) {
    return trimmed;
  }
  if (isCustomImageAvatar(trimmed)) {
    return trimmed;
  }
  return 'pipo_owl';
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Không thể đọc dữ liệu hình ảnh.'));
    img.src = src;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Không thể đọc tệp ảnh đã chọn.'));
      }
    };
    reader.onerror = () => reject(new Error('Lỗi khi đọc tệp ảnh từ thiết bị.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Resizes and center-crops an uploaded image into a compact square icon (<= 45KB data URL)
 * so it renders crisply as an avatar and fits comfortably inside Firestore rules limits.
 */
export async function compressAvatarImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP).');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Ảnh gốc quá lớn (tối đa 10 MB). Vui lòng chọn ảnh nhẹ hơn.');
  }

  const rawDataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(rawDataUrl);

  const srcWidth = img.naturalWidth || img.width;
  const srcHeight = img.naturalHeight || img.height;
  if (!srcWidth || !srcHeight) {
    throw new Error('Kích thước hình ảnh không hợp lệ.');
  }

  const cropSize = Math.min(srcWidth, srcHeight);
  const sx = Math.floor((srcWidth - cropSize) / 2);
  const sy = Math.floor((srcHeight - cropSize) / 2);

  const attempts: Array<{ size: number; mime: 'image/webp' | 'image/jpeg'; quality: number }> = [
    { size: 128, mime: 'image/webp', quality: 0.82 },
    { size: 128, mime: 'image/jpeg', quality: 0.8 },
    { size: 96, mime: 'image/webp', quality: 0.75 },
    { size: 96, mime: 'image/jpeg', quality: 0.72 },
    { size: 72, mime: 'image/jpeg', quality: 0.65 },
  ];

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');
  }

  for (const attempt of attempts) {
    canvas.width = attempt.size;
    canvas.height = attempt.size;
    ctx.clearRect(0, 0, attempt.size, attempt.size);

    if (attempt.mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, attempt.size, attempt.size);
    }

    ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, attempt.size, attempt.size);
    const outputUrl = canvas.toDataURL(attempt.mime, attempt.quality);

    if (isCustomImageAvatar(outputUrl) && outputUrl.length <= 45000) {
      return outputUrl;
    }
  }

  throw new Error('Ảnh sau khi nén vẫn vượt quá dung lượng cho phép. Vui lòng chọn ảnh đơn giản hơn.');
}
