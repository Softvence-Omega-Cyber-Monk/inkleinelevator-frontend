import {
  useGetAllFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "@/Redux/features/AdminDashboard/contentManagement/faq/faqApi";
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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// FAQ Item Component with Rich Text Editor
interface FAQItemProps {
  faq: { qaCardId?: string; question: string; ans: string };
  index: number;
  onQuestionChange: (index: number, value: string) => void;
  onAnswerChange: (index: number, value: string) => void;
  onDelete: (index: number, faqId?: string) => void;
}

function FAQItem({
  faq,
  index,
  onQuestionChange,
  onAnswerChange,
  onDelete,
}: FAQItemProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: "Enter the answer...",
      }),
    ],
    content: faq.ans || "",
    onUpdate: ({ editor }) => {
      onAnswerChange(index, editor.getHTML());
    },
  });

  // Update editor content when FAQ answer changes externally
  useEffect(() => {
    if (editor && editor.getHTML() !== faq.ans) {
      editor.commands.setContent(faq.ans || "");
    }
  }, [faq.ans, editor]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          FAQ {index + 1}
        </span>
        <button
          onClick={() => onDelete(index, faq.qaCardId)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete FAQ"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => onQuestionChange(index, e.target.value)}
            placeholder="How does bidding work?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer
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

export default function FAQsSectionTab() {
  const { data, isLoading, refetch } = useGetAllFAQsQuery();
  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const faqsData = data?.data || [];

  // Form state for FAQs
  const [faqs, setFaqs] = useState<
    Array<{ qaCardId?: string; question: string; ans: string }>
  >([]);

  // Contact information state (if needed in future)
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: "",
    email: "",
    website: "",
    businessAddress: "",
  });

  // Set default values when data is fetched
  useEffect(() => {
    if (faqsData && faqsData.length > 0) {
      setFaqs(
        faqsData.map((faq) => ({
          qaCardId: faq.qaCardId,
          question: faq.question || "",
          ans: faq.ans || "",
        }))
      );
    } else if (!isLoading) {
      // If no FAQs exist, initialize with empty form
      setFaqs([
        {
          question: "",
          ans: "",
        },
      ]);
    }
  }, [faqsData, isLoading]);

  // Handle question change
  const handleQuestionChange = (index: number, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index].question = value;
    setFaqs(newFaqs);
  };

  // Handle answer change
  const handleAnswerChange = (index: number, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index].ans = value;
    setFaqs(newFaqs);
  };

  // Add new FAQ
  const handleAddFAQ = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        ans: "",
      },
    ]);
  };

  // Delete FAQ
  const handleDeleteFAQ = async (index: number, faqId?: string) => {
    if (faqId) {
      // Delete from API
      try {
        await deleteFAQ(faqId).unwrap();
        toast.success("FAQ deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete FAQ");
      }
    } else {
      // Remove from local state if not saved yet
      const newFaqs = faqs.filter((_, i) => i !== index);
      setFaqs(newFaqs.length > 0 ? newFaqs : [{ question: "", ans: "" }]);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      // Save or update each FAQ
      for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];
        if (faq.question.trim() || faq.ans.trim()) {
          if (faq.qaCardId) {
            // Update existing FAQ
            await updateFAQ({
              id: faq.qaCardId,
              data: {
                question: faq.question,
                ans: faq.ans,
              },
            }).unwrap();
          } else {
            // Create new FAQ
            await createFAQ({
              question: faq.question,
              ans: faq.ans,
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
    if (faqsData && faqsData.length > 0) {
      setFaqs(
        faqsData.map((faq) => ({
          qaCardId: faq.qaCardId,
          question: faq.question || "",
          ans: faq.ans || "",
        }))
      );
    } else {
      setFaqs([
        {
          question: "",
          ans: "",
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">FAQs</h2>
          <p className="text-sm text-gray-600">
            Manage answers of frequently asked questions
          </p>
        </div>
        <button
          onClick={handleAddFAQ}
          className="mt-4 sm:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Add New FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.qaCardId || `faq-${index}`}
            faq={faq}
            index={index}
            onQuestionChange={handleQuestionChange}
            onAnswerChange={handleAnswerChange}
            onDelete={handleDeleteFAQ}
          />
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-4">Contact Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          Help people to swiftly contact (placeholder)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={contactInfo.phoneNumber}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, phoneNumber: e.target.value })
              }
              placeholder="+1 000 0000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, email: e.target.value })
              }
              placeholder="hello@inklein-elevatorproject.xyz"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={contactInfo.website}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, website: e.target.value })
            }
            placeholder="www.inklein-elevatorproject.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address
          </label>
          <input
            type="text"
            value={contactInfo.businessAddress}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, businessAddress: e.target.value })
            }
            placeholder="123 Street of Noun, New York, NY 10001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
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
