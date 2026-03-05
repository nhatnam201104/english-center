import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Input,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type {
  ListeningExam,
  ReadingExam,
} from "../../../../types/entrance-exam-lr/response";
import type { GetEntranceExamLRRequest } from "../../../../types/entrance-exam-lr/request";
import {
  getAllListening,
  getAllReading,
  createListening,
  createReading,
  deleteListening,
  deleteReading,
  activateListening,
  activateReading,
} from "../../../../services/entranceExamLR.service";
import type { ErrorApiResponse } from "../../../../types/api.type";
import ExamTable from "./exam.table";
import CreateExamDialog from "./create-exam.dialog";
import Pagination from "./Pagination";

const EntranceExamLRManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"listening" | "reading">("listening");

  /*  Listening state  */
  const [listeningExams, setListeningExams] = useState<ListeningExam[]>([]);
  const [listeningLoading, setListeningLoading] = useState(false);
  const [listeningPage, setListeningPage] = useState(1);
  const [listeningTotalPages, setListeningTotalPages] = useState(1);
  const [listeningTotal, setListeningTotal] = useState(0);
  const [listeningSearch, setListeningSearch] = useState("");

  /*  Reading state  */
  const [readingExams, setReadingExams] = useState<ReadingExam[]>([]);
  const [readingLoading, setReadingLoading] = useState(false);
  const [readingPage, setReadingPage] = useState(1);
  const [readingTotalPages, setReadingTotalPages] = useState(1);
  const [readingTotal, setReadingTotal] = useState(0);
  const [readingSearch, setReadingSearch] = useState("");

  /*  Dialog state  */
  const [showCreate, setShowCreate] = useState(false);

  /*  Load data  */
  const loadListening = useCallback(async () => {
    try {
      setListeningLoading(true);
      const params: GetEntranceExamLRRequest = { page: listeningPage, limit: 10 };
      if (listeningSearch) params.search = listeningSearch;
      const res = await getAllListening(params);
      setListeningExams(res.data?.data || []);
      setListeningTotalPages(res.data?.totalPages || 1);
      setListeningTotal(res.data?.totalItems || 0);
    } catch (error) {
      console.error("Loi khi tai Listening:", error);
    } finally {
      setListeningLoading(false);
    }
  }, [listeningPage, listeningSearch]);

  const loadReading = useCallback(async () => {
    try {
      setReadingLoading(true);
      const params: GetEntranceExamLRRequest = { page: readingPage, limit: 10 };
      if (readingSearch) params.search = readingSearch;
      const res = await getAllReading(params);
      setReadingExams(res.data?.data || []);
      setReadingTotalPages(res.data?.totalPages || 1);
      setReadingTotal(res.data?.totalItems || 0);
    } catch (error) {
      console.error("Loi khi tai Reading:", error);
    } finally {
      setReadingLoading(false);
    }
  }, [readingPage, readingSearch]);

  useEffect(() => { loadListening(); }, [loadListening]);
  useEffect(() => { loadReading(); }, [loadReading]);

  /*  Handlers  */
  const handleCreate = async (name: string, direction: string) => {
    if (activeTab === "listening") {
      await createListening({ name, direction });
      loadListening();
    } else {
      await createReading({ name, direction });
      loadReading();
    }
  };

  const handleDelete = async (id: number, type: "listening" | "reading") => {
    if (!window.confirm("Ban co chac chan muon xoa de thi nay?")) return;
    try {
      if (type === "listening") { await deleteListening(id); loadListening(); }
      else { await deleteReading(id); loadReading(); }
      alert("Xoa de thi thanh cong!");
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Xoa de thi that bai!");
    }
  };

  const handleActivate = async (id: number, type: "listening" | "reading") => {
    try {
      if (type === "listening") { await activateListening(id); loadListening(); }
      else { await activateReading(id); loadReading(); }
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Cap nhat trang thai that bai!");
    }
  };

  const handleView = (id: number, type: "listening" | "reading") => {
    navigate(`/admin/entrance-exam-lr/${type}/${id}`);
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
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Bài kiểm tra đầu vào TOEIC Listening & Reading
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Quản lý đề thi Toeic Listening và Reading, tạo mới, chỉnh sửa và kích hoạt đề thi cho học viên.
              </Typography>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => setShowCreate(true)}
            >
              <PlusIcon className="h-5 w-5" />
              Tạo đề thi {activeTab === "listening" ? "Listening" : "Reading"}
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <Tabs value={activeTab}>
            <TabsHeader>
              <Tab value="listening" onClick={() => setActiveTab("listening")}>
                Listening ({listeningTotal})
              </Tab>
              <Tab value="reading" onClick={() => setActiveTab("reading")}>
                Reading ({readingTotal})
              </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="listening">
                <div className="mb-4 w-72">
                  <Input
                    label="Tim kiem..."
                    icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                    value={listeningSearch}
                    onChange={(e) => { setListeningSearch(e.target.value); setListeningPage(1); }}
                  />
                </div>
                <ExamTable
                  exams={listeningExams}
                  loading={listeningLoading}
                  type="listening"
                  onView={(id) => handleView(id, "listening")}
                  onActivate={(id) => handleActivate(id, "listening")}
                  onDelete={(id) => handleDelete(id, "listening")}
                />
                <Pagination
                  page={listeningPage}
                  totalPages={listeningTotalPages}
                  onChange={setListeningPage}
                />
              </TabPanel>

              <TabPanel value="reading">
                <div className="mb-4 w-72">
                  <Input
                    label="Tim kiem..."
                    icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                    value={readingSearch}
                    onChange={(e) => { setReadingSearch(e.target.value); setReadingPage(1); }}
                  />
                </div>
                <ExamTable
                  exams={readingExams}
                  loading={readingLoading}
                  type="reading"
                  onView={(id) => handleView(id, "reading")}
                  onActivate={(id) => handleActivate(id, "reading")}
                  onDelete={(id) => handleDelete(id, "reading")}
                />
                <Pagination
                  page={readingPage}
                  totalPages={readingTotalPages}
                  onChange={setReadingPage}
                />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>

      <CreateExamDialog
        open={showCreate}
        type={activeTab}
        onClose={() => setShowCreate(false)}
        onSuccess={activeTab === "listening" ? loadListening : loadReading}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default EntranceExamLRManagement;
