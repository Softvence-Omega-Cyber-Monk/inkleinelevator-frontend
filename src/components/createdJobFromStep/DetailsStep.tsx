/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronDown, X } from "lucide-react";
// text editor
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

interface DetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DetailsStep({
  formData,
  setFormData,
  onNext,
  onBack,
}: DetailsStepProps) {
  // this code sinepet for text editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: "Describe the elevator project...",
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: formData.description || "",
    onUpdate: ({ editor }) =>
      setFormData({ ...formData, description: editor.getHTML() }),
  });
  return (
    <div>
      {/* Heading */}

      <div className="mb-8 ">
        <h2 className="text-xl font-medium text-gray-900">Details</h2>
        <p className="text-[#717182] text-base mt-2 border-b border-gray-200 inline-block shadow-xs  pb-3">
          Tell us more about the work involved.
        </p>
      </div>

      {/* Project Description here have text editor */}
      <div className="mb-8 mt-10">
        {/* Label for the editor */}
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Project Description
        </label>

        {/* Mantine RichTextEditor */}
        {editor && (
          <div className="rounded-lg p-2">
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.Highlight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignRight />
                  <RichTextEditor.AlignJustify />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.ColorPicker
                    colors={["#000000", "#e03131", "#2f9e44", "#1971c2"]}
                  />
                  <RichTextEditor.UnsetColor />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    • Bullet
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    1. Numbered
                  </button>
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content className="min-h-[200px] px-3 py-2" />
            </RichTextEditor>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1.5">
          Provide full details of the project scope, specifications, or special requests.
        </p>
      </div>

      {/* Technical Requirements */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Technical Requirements & Certifications
        </label>

        {/* Input for tags */}
        <input
          type="text"
          placeholder="Type a keyword and press Enter"
          className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800 text-gray-900 placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = (e.target as HTMLInputElement).value.trim();
              if (!value) return;

              setFormData((prev: any) => ({
                ...prev,
                technicalRequirements: [
                  ...(prev.technicalRequirements || []),
                  value,
                ],
              }));

              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Type each requirement or certification tag and press Enter to add.
        </p>

        {/* Display tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.technicalRequirements &&
            formData.technicalRequirements.length > 0 &&
            formData.technicalRequirements.map(
              (keyword: string, index: number) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  <span className="text-sm text-gray-700">{keyword}</span>
                  <button
                    onClick={() => {
                      setFormData((prev: any) => ({
                        ...prev,
                        technicalRequirements:
                          prev.technicalRequirements.filter(
                            (_: string, i: number) => i !== index,
                          ),
                      }));
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ),
            )}
        </div>
      </div>

      {/* Elevator Details */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Elevator Type
          </label>

          <div className="relative">
            <select
              value={formData.elevatorType} // bind value
              onChange={
                (e) =>
                  setFormData({ ...formData, elevatorType: e.target.value }) // update formData
              }
              className="w-full px-4 py-3 pr-10 bg-blue-50 border border-blue-100 rounded-lg
                 focus:outline-none focus:ring-1 focus:ring-gray-800
                 text-gray-900 appearance-none cursor-pointer"
            >
              <option value="">Select elevator type</option>
              <option value="Hydraulic">Hydraulic</option>
              <option value="raction">Traction (Geared)</option>
              <option value="MRL">Machine Room-Less (MRL)</option>
              <option value="freight">Freight</option>
              <option value="dumbwaiter">Dumbwaiter</option>
            </select>

            {/* Arrow icon */}
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Select the drive type or style of the elevator.
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Number of Elevators
          </label>
          <input
            type="text"
            placeholder="01"
            value={formData.numberOfElevators}
            onChange={(e) =>
              setFormData({
                ...formData,
                numberOfElevators: e.target.value,
              })
            }
            className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800 text-gray-900 placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Total number of elevator units to be serviced or installed.
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Capacity
          </label>
          <input
            type="text"
            placeholder="3500 lbs"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800 text-gray-900 placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Weight capacity rating (e.g. 2500 lbs, 3500 lbs).
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Speed
          </label>
          <input
            type="text"
            placeholder="500 FPM"
            value={formData.speed}
            onChange={(e) =>
              setFormData({ ...formData, speed: e.target.value })
            }
            className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800 text-gray-900 placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Elevator speed in FPM (e.g. 150 FPM, 500 FPM).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border-2 cursor-pointer border-gray-300 text-gray-500 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 cursor-pointer bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
