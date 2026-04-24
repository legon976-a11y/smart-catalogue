# Excel Import Guide / Excel Импорт Гарын Авлага

## English

### How to Use Excel Import Feature

The Smart Catalogue system now supports importing products directly from Excel files. This allows you to manage your product data efficiently and automatically populate your catalog.

#### Steps to Import Products:

1. **Click "Excel оруулах" Button**
   - Located in the top toolbar next to "Бараа оруулах"
   - Opens the Excel import modal

2. **Upload Excel File**
   - Click the drop zone or drag-and-drop your Excel file
   - Supported formats: `.xlsx`, `.xls`

3. **Preview Data**
   - The system will display a preview of your data
   - First 5 rows are shown in a table format
   - Verify all data looks correct

4. **Import Products**
   - Click "Импорт хийх" (Import) button
   - Success message will confirm the import
   - Products are immediately available in the product picker

#### Required Excel Columns:

| Column Name | Required | Description |
|-------------|----------|-------------|
| Нэр | ✅ | Product name / Бүтээгдэхүүний нэр |
| Үнэ | ✅ | Price (e.g., $250) / Үнэ |
| Зүйл | ✅ | Category / Зүйл |
| Хангагч | ❌ | Supplier/Author | Хангагч |
| Тайлбар | ❌ | Description / Тайлбар |

#### Download Sample Template:

Click "Excel загвар татах" link in the import modal to download a pre-formatted template with sample data.

#### Example Excel Data:

| Нэр | Үнэ | Зүйл | Хангагч | Тайлбар |
|-----|-----|------|---------|---------|
| Үнэлэмжит ширээ | $350 | Тавилга | Легон | Сайн гадаргуу, орчин үеийн загвар |
| Эргүүлэх сандал | $220 | Сандалс | Студио | Удаан эдэлгээтэй |
| 65 инч 4K ТВ | $899 | Электроник | Техно | Улаагүй, HD дүүжүүлэлт |

---

## Монгол хэл

### Excel Импорт Функцийг Ашиглах

Smart Catalogue систем Excel файлаас шууд бараа оруулахад дэмжлэг үзүүлэх болсон. Энэ нь таны бүтээгдэхүүний өгөгдлийг үр ашигтай удирдах ба каталогоо автоматаар дүүргэхийг зөвшөөрдөг.

#### Бараа Оруулах Алхмууд:

1. **"Excel оруулах" Товчийг Дарах**
   - Дээд хэрэгслүүр дээр "Бараа оруулах" дээрээ байрлуулнэ
   - Excel импорт модалиг онгойно

2. **Excel Файл Оруулах**
   - Үнтийн хүүхэлд дана эсвэл таны Excel файлыг чирнүүлэн орооно
   - Дэмжлэг үзүүлэлэ: `.xlsx`, `.xls`

3. **Мэдээлэл Урьдчилан Харах**
   - Систем таны өгөгдлийн урьдчилсан харалтыг харуулна
   - Эхнийх 5 мөр хүснэгт хэлбэрээр үзүүлнэ
   - Бүх өгөгдөл зөв эсэхийг баталгаажуулна

4. **Бараа Импортлох**
   - "Импорт хийх" товчийг дарна
   - Амжилтын мессеж импортын баталгаа өгнө
   - Бараа нь шууд бүтээгдэхүүний сонгогчид ашигтай болно

#### Excel-ийн Шаардлагатай Баганууд:

| Баганын Нэр | Шаардлага | Тайлбар |
|------------|----------|---------|
| Нэр | ✅ | Бүтээгдэхүүний нэр |
| Үнэ | ✅ | Үнэ (жишээ нь $250) |
| Зүйл | ✅ | Ангилал |
| Хангагч | ❌ | Хангагч/Зохиолч |
| Тайлбар | ❌ | Тайлбар |

#### Дээж Загвар Татах:

Импорт модал дээрх "Excel загвар татах" холбоосыг дана нэр өгөгдлийг агуулсан өмнөө форматлагдсан загварыг татана.

#### Excel Мэдээллийн Жишээ:

| Нэр | Үнэ | Зүйл | Хангагч | Тайлбар |
|-----|-----|------|---------|---------|
| Үнэлэмжит ширээ | $350 | Тавилга | Легон | Сайн гадаргуу, орчин үеийн загвар |
| Эргүүлэх сандал | $220 | Сандалс | Студио | Удаан эдэлгээтэй |
| 65 инч 4K ТВ | $899 | Электроник | Техно | Улаагүй, HD дүүжүүлэлт |

---

### Технологийн Өнгөрлүүлэлт

- **XLSX Library**: Excel файлыг JavaScript-ээр уншиход XLSX.js ашигладаг
- **Drag & Drop**: Файлыг шууд модалд чирнүүлэн орооход дэмжлэг үзүүлнэ
- **Live Preview**: File уншигдаад өгөгдөл стандартчилагдан урьдчилан харагдана
- **localStorage**: Импортлогдсон бараа кэшээ хадгалагдана

