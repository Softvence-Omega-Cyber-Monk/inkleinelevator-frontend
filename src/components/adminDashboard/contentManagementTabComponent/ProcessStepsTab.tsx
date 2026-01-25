import {
  useGetProcessStepSectionQuery,
  useCreateProcessStepSectionMutation,
  useUpdateProcessStepSectionMutation,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} from "@/Redux/features/AdminDashboard/contentManagement/processstep/processstepApi";
import React, { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

// Step Item Component with Rich Text Editor
interface StepItemProps {
  step: { id?: string; title: string; description: string };
  index: number;
  onTitleChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  onDelete: (index: number, stepId?: string) => void;
}

function StepItem({
  step,
  index,
  onTitleChange,
  onDescriptionChange,
  onDelete,
}: StepItemProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: "Describe the step...",
      }),
    ],
    content: step.description || "",
    onUpdate: ({ editor }) => {
      onDescriptionChange(index, editor.getHTML());
    },
  });

  // Update editor content when step description changes externally
  useEffect(() => {
    if (editor && editor.getHTML() !== step.description) {
      editor.commands.setContent(step.description || "");
    }
  }, [step.description, editor]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-red-500 border border-red-500 rounded px-2 py-1">
          Step {index + 1}
        </span>
        <button
          onClick={() => onDelete(index, step.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete step"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Step Title</label>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onTitleChange(index, e.target.value)}
            placeholder="Enter step title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Step Description
          </label>
          {editor && (
            <div className="rounded-lg border border-gray-300 bg-blue-50">
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

                <RichTextEditor.Content className="min-h-[150px] px-3 py-2" />
              </RichTextEditor>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProcessStepsTab() {
  const { data, isLoading, refetch } = useGetProcessStepSectionQuery();
  const [createSection] = useCreateProcessStepSectionMutation();
  const [updateSection] = useUpdateProcessStepSectionMutation();
  const [createStep] = useCreateStepMutation();
  const [updateStep] = useUpdateStepMutation();
  const [deleteStep] = useDeleteStepMutation();

  const sectionData = data?.data;

  // Form state
  const [formData, setFormData] = useState({
    sectionLabel: "",
    sectionTitle: "",
  });

  const [steps, setSteps] = useState<
    Array<{ id?: string; title: string; description: string; editor?: any }>
  >([]);

  // Set default values when data is fetched
  useEffect(() => {
    if (sectionData) {
      setFormData({
        sectionLabel: sectionData.sectionLabel || "",
        sectionTitle: sectionData.sectionTitle || "",
      });

      // Initialize steps with editors
      if (sectionData.steps && sectionData.steps.length > 0) {
        const stepsWithEditors = sectionData.steps.map((step) => ({
          id: step.id,
          title: step.title || "",
          description: step.description || "",
          editor: null, // Will be set by useEditor hook
        }));
        setSteps(stepsWithEditors);
      } else {
        // If no steps, add one empty step
        setSteps([
          {
            title: "",
            description: "",
            editor: null,
          },
        ]);
      }
    } else if (!isLoading) {
      // If no section exists, initialize with empty form
      setSteps([
        {
          title: "",
          description: "",
          editor: null,
        },
      ]);
    }
  }, [sectionData, isLoading]);


  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle step title change
  const handleStepTitleChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].title = value;
    setSteps(newSteps);
  };

  // Add new step
  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        title: "",
        description: "",
        editor: null,
      },
    ]);
  };

  // Delete step
  const handleDeleteStep = async (index: number, stepId?: string) => {
    if (stepId) {
      // Delete from API
      try {
        await deleteStep(stepId).unwrap();
        toast.success("Step deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete step");
      }
    } else {
      // Remove from local state if not saved yet
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      // First, ensure section exists
      if (!sectionData) {
        // Create section first
        await createSection({
          sectionLabel: formData.sectionLabel,
          sectionTitle: formData.sectionTitle,
        }).unwrap();
        toast.success("Section created successfully");
      } else {
        // Update section
        await updateSection({
          sectionLabel: formData.sectionLabel,
          sectionTitle: formData.sectionTitle,
        }).unwrap();
      }

      // Update or create steps
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.title.trim() || step.description.trim()) {
          if (step.id) {
            // Update existing step
            await updateStep({
              id: step.id,
              data: {
                title: step.title,
                description: step.description,
              },
            }).unwrap();
          } else {
            // Create new step
            await createStep({
              title: step.title,
              description: step.description,
            }).unwrap();
          }
        }
      }

      toast.success("Changes saved successfully!");
      refetch();
    } catch (error: any) {
      console.error("Failed to save changes:", error);
      toast.error(error?.data?.message || "Failed to save changes. Please try again.");
    }
  };

  // Handle reset
  const handleReset = () => {
    if (sectionData) {
      setFormData({
        sectionLabel: sectionData.sectionLabel || "",
        sectionTitle: sectionData.sectionTitle || "",
      });

      if (sectionData.steps && sectionData.steps.length > 0) {
        const stepsWithEditors = sectionData.steps.map((step) => ({
          id: step.id,
          title: step.title || "",
          description: step.description || "",
          editor: null,
        }));
        setSteps(stepsWithEditors);
      } else {
        setSteps([
          {
            title: "",
            description: "",
            editor: null,
          },
        ]);
      }
    } else {
      setFormData({
        sectionLabel: "",
        sectionTitle: "",
      });
      setSteps([
        {
          title: "",
          description: "",
          editor: null,
        },
      ]);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">
        How It Works Section
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Provide steps that outline your process
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Label
          </label>
          <input
            type="text"
            name="sectionLabel"
            value={formData.sectionLabel}
            onChange={handleChange}
            placeholder="How It Works Section"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            name="sectionTitle"
            value={formData.sectionTitle}
            onChange={handleChange}
            placeholder="How Our Elevator Service Works"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Process Steps
          </label>
          <button
            onClick={handleAddStep}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        {steps.map((step, index) => (
          <StepItem
            key={step.id || `step-${index}`}
            step={step}
            index={index}
            onTitleChange={handleStepTitleChange}
            onDescriptionChange={(idx, value) => {
              const newSteps = [...steps];
              newSteps[idx].description = value;
              setSteps(newSteps);
            }}
            onDelete={handleDeleteStep}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
