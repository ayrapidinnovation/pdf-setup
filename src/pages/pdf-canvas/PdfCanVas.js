import React from "react";
import { useState, useEffect, useRef } from "react";
import PdfFile from "../../assets/pdfFile.pdf";
import * as jsPDF from "jspdf";
import PdfSoccer from "../../assets/pdfSoccer.pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import pdfjs from "pdfjs-dist";
import {
  Container,
  Content,
  MailList,
  UserMail,
  SidePdfview,
  PdfContainer,
} from "./style";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const userMailList = [
  "jhonsmit@example.com",
  "canvas.laugh@example.com",
  "singh.nitin@example.com",
  "meredith.hendricks@example.com",
  "grant.marshall@example.com",
];

const doc = new jsPDF();
const PdfCanVas = () => {
  const [numPages, setNumPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPdf, setCurrentPdf] = useState(PdfFile);
  const canvasRef = useRef(null);
  const refs = useRef([]);
  const pageRef = useRef(null);

  useEffect(() => {
    const getPdf = async () => {
      const loadingTask = pdfjs.getDocument(currentPdf);
      const pdf = await loadingTask.promise;
      const numberOfPages = pdf._pdfInfo.numPages;
      if (numberOfPages > 0 && numPages.length <= 0) {
        const pages = [];
        for (let i = 1; i <= numberOfPages; i++) {
          pages.push(i);
        }
        setNumPages(pages);
      }
      const page = await pdf.getPage(currentPage);
      const canvas = canvasRef.current;
      const scale = 1;
      const viewport = page.getViewport({ scale: scale });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      const renderTask = page.render(renderContext);

      await renderTask.promise;
    };
    getPdf();
  }, [currentPage, currentPdf, numPages]);

  const modifyPdf = async () => {
    const img = canvasRef.current.toDataURL("image/png", 1.0);
    doc.addImage(img, "PNG", 0, 0);
    doc.addPage(currentPage);
    //console.log("internal=>", doc.internal.getNumberOfPages());
  };

  const handleDrop = (event) => {
    event.persist();
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    ctx.beginPath();
    ctx.rect(x, y, 220, 50);
    ctx.stroke();

    ctx.fillStyle = "#FBA880";
    ctx.lineWidth = "1";
    ctx.strokeStyle = "#FBA880";
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(id, x + 10, y + 30);

    modifyPdf();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const allowDrop = (ev) => {
    ev.persist();
    ev.preventDefault();
    return false;
  };

  const drag = (ev) => {
    ev.persist();
    ev.dataTransfer.setData("text", ev.target.id);
    return false;
  };

  const drop = (ev) => {
    ev.persist();
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    return false;
  };

  const selectPage = (page) => {
    setCurrentPage(page);
  };

  const downloadPdf = () => {
    doc.save("edited-file.pdf");
  };

  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  useEffect(() => {
    const renderSide = async () => {
      const loadingTask = pdfjs.getDocument(currentPdf);
      const pdf = await loadingTask.promise;
      for (let i = 0; i < numPages.length; i++) {
        const page = await pdf.getPage(i + 1);
        const canvas = refs.current[i];
        const scale = 0.3;
        const viewport = page.getViewport({ scale: scale });
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        const renderTask = page.render(renderContext);
        await renderTask.promise;

        console.log("canvas==>", canvas);
        console.log("page==>", page);
        const img = canvas.toDataURL("image/png");

        doc.addImage(img, 0, 0);
        doc.addPage(i + 1);
      }
      if (
        numPages.length > 0 &&
        doc.internal.getNumberOfPages() > numPages.length
      ) {
        doc.deletePage(numPages.length + 1);
      }
    };
    renderSide();
  }, [currentPdf, numPages]);

  const renderSidePDF = () => {
    return (
      <div>
        {numPages && numPages.length > 0 && (
          <div>
            {numPages.map((pageNum, k) => (
              <SidePdfview key={k}>
                <canvas ref={addToRefs} onClick={() => selectPage(pageNum)} />
                <p>{pageNum}</p>
              </SidePdfview>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Container>
      <button onClick={downloadPdf}>DownloadPdf</button>
      <Content>
        <MailList onDrop={(e) => drop(e)} onDragOver={(e) => allowDrop(e)}>
          {userMailList &&
            userMailList.map((v, k) => {
              return (
                <UserMail
                  key={k}
                  id={v}
                  draggable={true}
                  onDragStart={(e) => {
                    drag(e);
                  }}
                  onDragOver={() => {
                    return false;
                  }}
                >
                  {v}
                </UserMail>
              );
            })}
        </MailList>
        <PdfContainer>
          <canvas
            width={"100%"}
            height={window.innerHeight}
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            contentEditable={true}
          />
        </PdfContainer>
        <div>{renderSidePDF()}</div>
      </Content>
    </Container>
  );
};
export default PdfCanVas;
