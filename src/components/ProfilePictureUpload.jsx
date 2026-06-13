import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Camera, X, ZoomIn, ZoomOut, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function getCroppedBlob(imageSrc, pixelCrop, rotation = 0) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = Math.min(pixelCrop.width, pixelCrop.height);
      canvas.width = size;
      canvas.height = size;

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, size, size
      );

      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Canvas is empty")); return; }
        resolve(blob);
      }, "image/jpeg", 0.95);
    };
    image.onerror = reject;
  });
}

export default function ProfilePictureUpload({ value, onChange }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setShowModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      onChange(file);
      setShowModal(false);
    } catch {
      alert("Failed to crop image");
    }
  };

  const handleRemove = () => {
    onChange(null);
    setImageSrc(null);
  };

  return (
    <>
      <div>
        <label className="mb-1 block text-sm font-medium">Profile picture</label>
        {value ? (
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-emerald-200 shadow-sm">
              <img src={URL.createObjectURL(value)} alt="Profile preview" className="h-full w-full object-cover" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImageSrc(reader.result);
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                    setShowModal(true);
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition">
                Edit
              </button>
              <button type="button" onClick={handleRemove} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50/30 transition">
            <Camera className="h-6 w-6" />
            <span className="text-sm font-medium">Choose Your Profile Picture</span>
            <span className="text-xs text-gray-400">JPG, PNG or WebP</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </label>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-elevated overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <h3 className="text-base font-bold text-gray-900">Adjust your picture</h3>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-lg p-1 hover:bg-gray-100 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative h-72 w-full bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <ZoomOut className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <ZoomIn className="h-4 w-4 text-gray-400 shrink-0" />
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-5 py-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
