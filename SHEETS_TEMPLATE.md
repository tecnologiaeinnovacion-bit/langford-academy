# Google Sheets template (Langford Academy)

Usa **3 hojas** en el archivo de Google Sheets:

## 1) Hoja `courses_raw`
Cada fila representa una actividad/lección.

Encabezados obligatorios:

```csv
courseId,courseTitle,instructor,instructorTitle,courseDescription,courseLongDescription,rating,reviewsCount,studentsCount,courseDuration,level,category,image,bannerImage,certificatePrice,tags,moduleId,moduleTitle,lessonId,lessonTitle,lessonDuration,lessonType,lessonUrl,lessonContent,required,taskPrompt,quizId,quizQuestion,quizOptions,quizAnswer,quizExplanation
```

Notas:
- `lessonType`: `video|reading|quiz|task|link|file`
- `quizOptions`: separadas con `|` (ejemplo: `A|B|C|D`)
- `required`: `true` o `false`
- `tags`: separadas con `|`

## 2) Hoja `users`
Encabezados:

```csv
id,name,email,phone,country,role
```

## 3) Hoja `payments`
Encabezados:

```csv
paymentId,userId,courseId,certificateId,amount,status,provider,token,createdAt,updatedAt
```

- `status`: `PENDING|PAID|FAILED`
- `token`: token fijo para conciliación (ejemplo: `LANGFORD_PSE_TOKEN`)

---

## Cómo conectarlo en la app
1. Publica el Sheet como CSV (hoja `courses_raw`).
2. Crea `.env`:

```bash
VITE_COURSES_SHEET_URL="https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=<GID_COURSES_RAW>"
```

3. Reinicia Vite.

La app tomará cursos automáticamente desde ese CSV si hay filas válidas.
