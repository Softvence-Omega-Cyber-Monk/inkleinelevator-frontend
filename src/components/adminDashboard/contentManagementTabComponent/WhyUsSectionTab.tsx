import {
  useGetHowItsForSectionQuery,
  useCreateHowItsForSectionMutation,
  useUpdateHowItsForSectionMutation,
  useCreateCardMutation,
  useUpdateCardMutation,
} from "@/Redux/features/AdminDashboard/contentManagement/howitsfor/howitsforApi";
import { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";

// Audience Card Component with Rich Text Editor
interface AudienceCardProps {
  audience: {
    audienceId?: string;
    type: string;
    cardTitle: string;
    cardSubtitle: string;
    bulletText: string;
  };
  title: string;
  onCardTitleChange: (value: string) => void;
  onCardSubtitleChange: (value: string) => void;
  onBulletTextChange: (value: string) => void;
}

function AudienceCard({
  audience,
  title,
  onCardTitleChange,
  onCardSubtitleChange,
  onBulletTextChange,
}: AudienceCardProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: "Describe key elements...",
      }),
    ],
    content: audience.bulletText || "",
    onUpdate: ({ editor }) => {
      onBulletTextChange(editor.getHTML());
    },
  });

  // Update editor content when bulletText changes externally
  useEffect(() => {
    if (editor && editor.getHTML() !== audience.bulletText) {
      editor.commands.setContent(audience.bulletText || "");
    }
  }, [audience.bulletText, editor]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-700 mb-4">{title}</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Card Title</label>
          <input
            type="text"
            value={audience.cardTitle}
            onChange={(e) => onCardTitleChange(e.target.value)}
            placeholder="Enter Your Answer (Ai)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Card Subtitle
          </label>
          <input
            type="text"
            value={audience.cardSubtitle}
            onChange={(e) => onCardSubtitleChange(e.target.value)}
            placeholder="G-r (Ans Elevator, our values to contribute..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Bullet Points
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

export default function WhyUsSectionTab() {
  const { data, isLoading, refetch } = useGetHowItsForSectionQuery();
  const [createSection] = useCreateHowItsForSectionMutation();
  const [updateSection] = useUpdateHowItsForSectionMutation();
  const [createCard] = useCreateCardMutation();
  const [updateCard] = useUpdateCardMutation();

  const sectionData = data?.data;

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    title: "",
    subtitle: "",
  });

  const [jobRequesterCard, setJobRequesterCard] = useState({
    audienceId: undefined as string | undefined,
    type: "JOB_REQUESTER",
    cardTitle: "",
    cardSubtitle: "",
    bulletText: "",
  });

  const [contractorCard, setContractorCard] = useState({
    audienceId: undefined as string | undefined,
    type: "CONTRACTOR",
    cardTitle: "",
    cardSubtitle: "",
    bulletText: "",
  });

  // Set default values when data is fetched
  useEffect(() => {
    if (sectionData) {
      setFormData({
        label: sectionData.label || "",
        title: sectionData.title || "",
        subtitle: sectionData.subtitle || "",
      });

      // Set audience cards
      if (sectionData.audiences && sectionData.audiences.length > 0) {
        const jobRequester = sectionData.audiences.find(
          (a) => a.type === "JOB_REQUESTER"
        );
        const contractor = sectionData.audiences.find(
          (a) => a.type === "CONTRACTOR"
        );

        if (jobRequester) {
          setJobRequesterCard({
            audienceId: jobRequester.audienceId,
            type: "JOB_REQUESTER",
            cardTitle: jobRequester.cardTitle || "",
            cardSubtitle: jobRequester.cardSubtitle || "",
            bulletText: jobRequester.bulletText || "",
          });
        }

        if (contractor) {
          setContractorCard({
            audienceId: contractor.audienceId,
            type: "CONTRACTOR",
            cardTitle: contractor.cardTitle || "",
            cardSubtitle: contractor.cardSubtitle || "",
            bulletText: contractor.bulletText || "",
          });
        }
      }
    }
  }, [sectionData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      // First, ensure section exists
      if (!sectionData) {
        // Create section first
        await createSection({
          label: formData.label,
          title: formData.title,
          subtitle: formData.subtitle,
        }).unwrap();
        toast.success("Section created successfully");
      } else {
        // Update section
        await updateSection({
          label: formData.label,
          title: formData.title,
          subtitle: formData.subtitle,
        }).unwrap();
      }

      // Save or update Job Requester card
      if (jobRequesterCard.cardTitle.trim() || jobRequesterCard.cardSubtitle.trim() || jobRequesterCard.bulletText.trim()) {
        if (jobRequesterCard.audienceId) {
          await updateCard({
            id: jobRequesterCard.audienceId,
            data: {
              type: jobRequesterCard.type,
              cardTitle: jobRequesterCard.cardTitle,
              cardSubtitle: jobRequesterCard.cardSubtitle,
              bulletText: jobRequesterCard.bulletText,
            },
          }).unwrap();
        } else {
          await createCard({
            type: jobRequesterCard.type,
            cardTitle: jobRequesterCard.cardTitle,
            cardSubtitle: jobRequesterCard.cardSubtitle,
            bulletText: jobRequesterCard.bulletText,
          }).unwrap();
        }
      }

      // Save or update Contractor card
      if (contractorCard.cardTitle.trim() || contractorCard.cardSubtitle.trim() || contractorCard.bulletText.trim()) {
        if (contractorCard.audienceId) {
          await updateCard({
            id: contractorCard.audienceId,
            data: {
              type: contractorCard.type,
              cardTitle: contractorCard.cardTitle,
              cardSubtitle: contractorCard.cardSubtitle,
              bulletText: contractorCard.bulletText,
            },
          }).unwrap();
        } else {
          await createCard({
            type: contractorCard.type,
            cardTitle: contractorCard.cardTitle,
            cardSubtitle: contractorCard.cardSubtitle,
            bulletText: contractorCard.bulletText,
          }).unwrap();
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
        label: sectionData.label || "",
        title: sectionData.title || "",
        subtitle: sectionData.subtitle || "",
      });

      if (sectionData.audiences && sectionData.audiences.length > 0) {
        const jobRequester = sectionData.audiences.find(
          (a) => a.type === "JOB_REQUESTER"
        );
        const contractor = sectionData.audiences.find(
          (a) => a.type === "CONTRACTOR"
        );

        if (jobRequester) {
          setJobRequesterCard({
            audienceId: jobRequester.audienceId,
            type: "JOB_REQUESTER",
            cardTitle: jobRequester.cardTitle || "",
            cardSubtitle: jobRequester.cardSubtitle || "",
            bulletText: jobRequester.bulletText || "",
          });
        } else {
          setJobRequesterCard({
            audienceId: undefined,
            type: "JOB_REQUESTER",
            cardTitle: "",
            cardSubtitle: "",
            bulletText: "",
          });
        }

        if (contractor) {
          setContractorCard({
            audienceId: contractor.audienceId,
            type: "CONTRACTOR",
            cardTitle: contractor.cardTitle || "",
            cardSubtitle: contractor.cardSubtitle || "",
            bulletText: contractor.bulletText || "",
          });
        } else {
          setContractorCard({
            audienceId: undefined,
            type: "CONTRACTOR",
            cardTitle: "",
            cardSubtitle: "",
            bulletText: "",
          });
        }
      }
    } else {
      setFormData({
        label: "",
        title: "",
        subtitle: "",
      });
      setJobRequesterCard({
        audienceId: undefined,
        type: "JOB_REQUESTER",
        cardTitle: "",
        cardSubtitle: "",
        bulletText: "",
      });
      setContractorCard({
        audienceId: undefined,
        type: "CONTRACTOR",
        cardTitle: "",
        cardSubtitle: "",
        bulletText: "",
      });
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
        Why Us?/For Section
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage what sets your service apart
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Label
          </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="Provide services from trusted sub"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Write a short compelling thought"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
      </div>

      {/* Job Requisitions */}
      <div className="mb-4">
        <AudienceCard
          audience={jobRequesterCard}
          title="Job Requisitions"
          onCardTitleChange={(value) =>
            setJobRequesterCard({ ...jobRequesterCard, cardTitle: value })
          }
          onCardSubtitleChange={(value) =>
            setJobRequesterCard({ ...jobRequesterCard, cardSubtitle: value })
          }
          onBulletTextChange={(value) =>
            setJobRequesterCard({ ...jobRequesterCard, bulletText: value })
          }
        />
      </div>

      {/* Contractors */}
      <div className="mb-4">
        <AudienceCard
          audience={contractorCard}
          title="Contractors"
          onCardTitleChange={(value) =>
            setContractorCard({ ...contractorCard, cardTitle: value })
          }
          onCardSubtitleChange={(value) =>
            setContractorCard({ ...contractorCard, cardSubtitle: value })
          }
          onBulletTextChange={(value) =>
            setContractorCard({ ...contractorCard, bulletText: value })
          }
        />
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
