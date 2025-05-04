"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import Tesseract from "tesseract.js";

export default function UploadOCRPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      setErrorMessage("No authentication token found. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      console.log("Token fetched:", storedToken);
    }
  }, [router]);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/health", { timeout: 5000 });
        console.log("Server health check:", response.data);
      } catch (err) {
        console.error("Server health check failed:", err);
        setErrorMessage("Server is unreachable. Please ensure the backend is running at http://127.0.0.1:5000.");
      }
    };
    checkServerHealth();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit");
      setUploadStatus("error");
      return;
    }
    setUploadedFile(file);
    setUploadStatus("uploading");
    setErrorMessage(null);

    try {
      const result = await Tesseract.recognize(file, "eng", { logger: (m) => console.log("Tesseract progress:", m) });
      const text = result.data.text.trim();
      if (!text) {
        throw new Error("No text extracted from image");
      }
      setExtractedText(text);
      setUploadStatus("success");

      if (!token) {
        throw new Error("No authentication token available");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text);
      formData.append("email", "testuser@example.com");

      console.log("Sending request to:", "http://127.0.0.1:5000/api/ocr/upload-ocr");
      const response = await axios.post("http://127.0.0.1:5000/api/ocr/upload-ocr", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      console.log("Backend response:", response.data);
      setErrorMessage(null);
    } catch (err) {
      const error = err as AxiosError;
      console.error("API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrorMessage(error.response.data?.error || "Bad request. Check file or input data.");
            break;
          case 401:
            setErrorMessage("Unauthorized access. Redirecting to login...");
            localStorage.removeItem("token");
            setTimeout(() => router.push("/login"), 2000);
            break;
          case 405:
            setErrorMessage("Server does not accept POST requests for /api/ocr/upload-ocr. Check backend configuration.");
            break;
          case 500:
            setErrorMessage("Server error. Please try again later or contact support.");
            break;
          default:
            setErrorMessage(`Request failed with status ${error.response.status}: ${error.message}`);
        }
      } else if (error.code === "ECONNABORTED") {
        setErrorMessage("Request timed out. Please check your network and server.");
      } else {
        setErrorMessage(`Network error: ${error.message}`);
      }
      setUploadStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">Document Upload & OCR</h1>
          <p className="text-gray-500 mt-2">
            Upload your insurance documents for quick processing using our OCR technology
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="review" disabled={!extractedText}>
              Review & Verify
            </TabsTrigger>
            <TabsTrigger value="history">Document History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>Upload your insurance documents for automatic text extraction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-60 ${
                        dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {uploadStatus === "idle" && (
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 text-center mb-2">
                            Drag & drop your document here, or click to browse
                          </p>
                          <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleChange}
                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("file-upload")?.click()}
                            className="mt-2"
                          >
                            Browse Files
                          </Button>
                        </>
                      )}

                      {uploadStatus === "uploading" && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                          <p className="text-sm text-gray-600">Processing document...</p>
                          <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
                        </div>
                      )}

                      {uploadStatus === "success" && (
                        <div className="text-center">
                          <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                          <p className="text-sm text-gray-600">Document processed successfully!</p>
                          <p className="text-xs text-emerald-600 mt-2">
                            {uploadedFile?.name} ({Math.round((uploadedFile?.size || 0) / 1024)} KB)
                          </p>
                        </div>
                      )}

                      {uploadStatus === "error" && errorMessage && (
                        <div className="text-center">
                          <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />
                          <p className="text-sm text-gray-600">Error processing document</p>
                          <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setUploadStatus("idle");
                              setUploadedFile(null);
                              setExtractedText(null);
                              setErrorMessage(null);
                            }}
                            className="mt-4"
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, PDF (max 10MB)</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="document-type">Document Type</Label>
                      <select
                        id="document-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select document type</option>
                        <option value="policy">Insurance Policy</option>
                        <option value="id">ID Proof</option>
                        <option value="property">Property Document</option>
                        <option value="claim">Claim Form</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="document-description">Description (Optional)</Label>
                      <Input id="document-description" placeholder="Brief description of the document" />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Why use OCR?</h3>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 mt-0.5" />
                          <span>Automatically extract text from your documents</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 mt-0.5" />
                          <span>Save time on manual data entry</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 mt-0.5" />
                          <span>Reduce errors in document processing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 mt-0.5" />
                          <span>Faster claim processing and verification</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Review & Verify</CardTitle>
                <CardDescription>Review the extracted text and verify its accuracy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Document Preview</Label>
                    <div className="border rounded-lg overflow-hidden h-80 relative">
                      {uploadedFile && (
                        <Image
                          src={URL.createObjectURL(uploadedFile)}
                          alt="Document Preview"
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="extracted-text" className="mb-2 block">
                      Extracted Text
                    </Label>
                    <textarea
                      id="extracted-text"
                      className="w-full h-80 p-3 text-sm font-mono border rounded-lg resize-none"
                      value={extractedText || ""}
                      onChange={(e) => setExtractedText(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  Back
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setActiveTab("history")}>
                  Confirm & Save
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Document History</CardTitle>
                <CardDescription>View and manage your previously uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Insurance Policy</h3>
                        <p className="text-sm text-gray-500">Uploaded on 15 Apr, 2023</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}