package com.smartlibrary.service;

import com.smartlibrary.entity.Book;
import com.smartlibrary.repository.BookRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ReportService {

    private final BookRepository bookRepository;

    public ReportService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public byte[] generateBooksPdf() {
        List<Book> books = bookRepository.findAll();
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);
                contentStream.newLineAtOffset(50, 780);
                contentStream.showText("Smart Library - Book Report");
                contentStream.endText();

                int y = 740;
                for (Book book : books) {
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
                    contentStream.newLineAtOffset(50, y);
                    String line = String.format("%s | ISBN: %s | Qty: %s | Available: %s",
                            book.getTitle(),
                            book.getIsbn(),
                            book.getQuantity(),
                            book.getAvailableCopies());
                    contentStream.showText(line);
                    contentStream.endText();
                    y -= 18;
                    if (y < 60) {
                        break;
                    }
                }
            }
            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to generate PDF report", exception);
        }
    }

    public byte[] generateBooksExcel() {
        List<Book> books = bookRepository.findAll();
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            var sheet = workbook.createSheet("Books");
            Row header = sheet.createRow(0);
            String[] columns = {"ID", "Title", "ISBN", "Quantity", "Available Copies"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
            }
            int rowIndex = 1;
            for (Book book : books) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(book.getId());
                row.createCell(1).setCellValue(book.getTitle());
                row.createCell(2).setCellValue(book.getIsbn());
                row.createCell(3).setCellValue(book.getQuantity() == null ? 0 : book.getQuantity());
                row.createCell(4).setCellValue(book.getAvailableCopies() == null ? 0 : book.getAvailableCopies());
            }
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to generate Excel report", exception);
        }
    }
}
