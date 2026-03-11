import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Spinner,
  Input,
} from "@material-tailwind/react";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { createExamSchema, type CreateExamFormData } from "../../../../libs/validation/exam.schema";
import { createExam, updateExam, getExamById, getPart1, getPart2, getPart3 } from "../../../../services/exam.service";
import type { Exam, WritingOneToFive, WritingSixSeven, WritingEight } from "../../../../types/exam/response";
import Part1Editor from "./part1.editor";
import Part2Editor from "./part2.editor";
import Part3Editor from "./part3.editor";

type TabType = "general" | "part1" | "part2" | "part3";

const ExamEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [loading, setLoading] = useState(false);
  const [examId, setExamId] = useState<number | null>(isEditing ? Number(id) : null);
  const [, setExamData] = useState<Exam | null>(null);
  const [part1Data, setPart1Data] = useState<WritingOneToFive | null>(null);
  const [part2Data, setPart2Data] = useState<WritingSixSeven | null>(null);
  const [part3Data, setPart3Data] = useState<WritingEight | null>(null);
  const [savedParts, setSavedParts] = useState<Record<string, boolean>>({
    part1: false,
    part2: false,
    part3: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateExamFormData>({
    resolver: zodResolver(createExamSchema) as never,
    defaultValues: {
      isActive: false,
    },
  });

  useEffect(() => {
    if (isEditing && examId) {
      loadExamData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, examId]);

  const loadExamData = async () => {
    try {
      const [examResponse, part1Response, part2Response, part3Response] = await Promise.all([
        getExamById(examId!),
        getPart1(examId!),
        getPart2(examId!),
        getPart3(examId!),
      ]);

      if (examResponse.success && examResponse.data) {
        setExamData(examResponse.data);
        setValue("name", examResponse.data.name);
        setValue("isActive", examResponse.data.isActive);
      }

      if (part1Response.success && part1Response.data && part1Response.data.length > 0) {
        setPart1Data(part1Response.data[0]);
        setSavedParts((prev) => ({ ...prev, part1: true }));
      }

      if (part2Response.success && part2Response.data && part2Response.data.length > 0) {
        setPart2Data(part2Response.data[0]);
        setSavedParts((prev) => ({ ...prev, part2: true }));
      }

      if (part3Response.success && part3Response.data && part3Response.data.length > 0) {
        setPart3Data(part3Response.data[0]);
        setSavedParts((prev) => ({ ...prev, part3: true }));
      }
    } catch (error) {
      console.error("Error loading exam data:", error);
      alert("Lỗi khi tải dữ liệu đề thi");
    }
  };

  const handleGeneralSubmit = async (data: CreateExamFormData) => {
    try {
      setLoading(true);

      if (isEditing && examId) {
        const response = await updateExam({ ...data, id: examId });
        if (response.success && response.data) {
          setExamData(response.data);
          alert("Cập nhật đề thi thành công!");
        }
      } else {
        const response = await createExam(data);
        if (response.success && response.data) {
          setExamId(response.data.id);
          setExamData(response.data);
          alert("Tạo đề thi thành công!");
          setActiveTab("part1");
        }
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Error saving exam:", error);
      alert(apiError?.message || "Lỗi khi lưu đề thi!");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (!examId && tab !== "general") {
      alert("Vui lòng lưu thông tin chung trước!");
      return;
    }
    setActiveTab(tab);
  };

  const handlePartSave = (part: "part1" | "part2" | "part3") => {
    setSavedParts((prev) => ({ ...prev, [part]: true }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                className="text-white hover:bg-white/10"
                onClick={() => navigate("/admin/content/sw")}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <div>
                <Typography variant="h4" color="white" className="font-bold">
                  {isEditing ? "Chỉnh Sửa Đề Thi Writing" : "Tạo Đề Thi Writing Mới"}
                </Typography>
                <Typography variant="small" color="white" className="mt-1 opacity-90">
                  {isEditing ? "Cập nhật thông tin đề thi" : "Điền đầy đủ thông tin để tạo đề thi"}
                </Typography>
              </div>
            </div>
            {examId && (
              <div className="text-white">
                <Typography variant="small" className="opacity-90">
                  ID: {examId}
                </Typography>
              </div>
            )}
          </div>
        </CardHeader>

        <CardBody className="p-6">
          {/* Progress Indicator */}
          {examId && (
            <div className="mb-6 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                {savedParts.part1 && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                <Typography variant="small" className={savedParts.part1 ? "text-green-600" : "text-gray-500"}>
                  Part 1
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                {savedParts.part2 && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                <Typography variant="small" className={savedParts.part2 ? "text-green-600" : "text-gray-500"}>
                  Part 2
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                {savedParts.part3 && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                <Typography variant="small" className={savedParts.part3 ? "text-green-600" : "text-gray-500"}>
                  Part 3
                </Typography>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} orientation="horizontal">
            <TabsHeader className="bg-transparent border-b border-gray-200">
              <Tab
                value="general"
                onClick={() => handleTabChange("general")}
                className={activeTab === "general" ? "text-blue-600 border-blue-600" : ""}
              >
                1. Thông tin chung
              </Tab>
              <Tab
                value="part1"
                onClick={() => handleTabChange("part1")}
                disabled={!examId}
                className={activeTab === "part1" ? "text-blue-600 border-blue-600" : ""}
              >
                2. Câu 1-5 (5 ảnh)
              </Tab>
              <Tab
                value="part2"
                onClick={() => handleTabChange("part2")}
                disabled={!examId}
                className={activeTab === "part2" ? "text-blue-600 border-blue-600" : ""}
              >
                3. Câu 6-7 (2 ảnh)
              </Tab>
              <Tab
                value="part3"
                onClick={() => handleTabChange("part3")}
                disabled={!examId}
                className={activeTab === "part3" ? "text-blue-600 border-blue-600" : ""}
              >
                4. Câu 8 (Bài luận)
              </Tab>
            </TabsHeader>

            <TabsBody className="py-6">
              {/* General Info Tab */}
              <TabPanel value="general">
                <Card className="shadow-lg">
                  <CardBody>
                    <form onSubmit={handleSubmit(handleGeneralSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Input
                            label="Tên đề thi"
                            {...register("name")}
                            error={!!errors.name}
                            crossOrigin={undefined}
                          />
                          {errors.name && (
                            <Typography variant="small" color="red" className="mt-1">
                              {errors.name.message}
                            </Typography>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            id="isActive"
                            {...register("isActive", { valueAsNumber: false })}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="isActive" className="text-sm font-medium text-gray-900">
                            Kích hoạt đề thi
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/admin/content/sw")}
                          disabled={loading}
                        >
                          Hủy
                        </Button>
                        <Button type="submit" className="bg-blue-600" disabled={loading}>
                          {loading ? (
                            <>
                              <Spinner className="h-4 w-4" />
                              Đang lưu...
                            </>
                          ) : isEditing ? (
                            "Cập Nhật"
                          ) : (
                            "Tạo Đề Thi"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Part 1 Tab */}
              <TabPanel value="part1">
                {examId && (
                  <Part1Editor
                    examId={examId}
                    index={0}
                    initialData={part1Data ?? undefined}
                    onSave={() => handlePartSave("part1")}
                  />
                )}
              </TabPanel>

              {/* Part 2 Tab */}
              <TabPanel value="part2">
                {examId && (
                  <Part2Editor
                    examId={examId}
                    index={0}
                    initialData={part2Data ?? undefined}
                    onSave={() => handlePartSave("part2")}
                  />
                )}
              </TabPanel>

              {/* Part 3 Tab */}
              <TabPanel value="part3">
                {examId && (
                  <Part3Editor
                    examId={examId}
                    index={0}
                    initialData={part3Data ?? undefined}
                    onSave={() => handlePartSave("part3")}
                  />
                )}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default ExamEditor;