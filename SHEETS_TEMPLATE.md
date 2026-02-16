# Google Sheets template (Langford Academy)

Usa este Sheet como **backend adicional** para:
1) **Importar datos a la web** (cursos, usuarios, contenido), y
2) **Recibir snapshot de la web** por webhook (modo push).

## 1) Hoja `courses_raw` (import -> web)
Cada fila representa una actividad/lección.

Encabezados obligatorios:

```csv
courseId,courseTitle,instructor,instructorTitle,courseDescription,courseLongDescription,rating,reviewsCount,studentsCount,courseDuration,level,category,image,bannerImage,certificatePrice,tags,courseIncludes,breadcrumbLabel,moduleId,moduleTitle,lessonId,lessonTitle,lessonDuration,lessonType,lessonUrl,lessonContent,required,taskPrompt,quizId,quizQuestion,quizOptions,quizAnswer,quizExplanation
```

Notas:
- `lessonType`: `video|reading|quiz|task|link|file`
- `quizOptions`: separadas con `|` (ejemplo: `A|B|C|D`)
- `required`: `true` o `false`
- `tags`: separadas con `|`
- `courseIncludes`: ítems de “Este curso incluye” separados con `|`
- `breadcrumbLabel`: texto del breadcrumb (ej: `Explorar Programas`)

## 2) Hoja `users` (import -> web)
Encabezados:

```csv
id,name,email,phone,country,role,password
```

- `role`: `USER` o `ADMIN`

## 3) Hoja `site_content` (import -> web)
Formato clave-valor.

Encabezados:

```csv
key,value
```

Ejemplos de `key` soportadas:
- `heroTitle`, `heroSubtitle`, `heroCta`
- `infoTitle`, `infoBody`, `infoBullets` (`|` separado)
- `sponsorsTitle`, `sponsorsLogos` (`|` separado)
- `promosTitle`, `promosBody`, `promosHighlights` (`|` separado)
- `contactTitle`, `contactBody`, `addressTitle`, `addressBody`
- `legalTitle`, `legalLinks` (`|` separado)
- `hoursTitle`, `hoursBody`, `footerNote`
- `bodyFont`, `headingFont`, `accentColor`, `primaryColor`, `heroTitleSize`, `heroSubtitleSize`, `borderRadius`

## 4) Hoja `payments` (export opcional)
Encabezados:

```csv
paymentId,userId,courseId,certificateId,amount,status,provider,token,createdAt,updatedAt
```

- `status`: `PENDING|PAID|FAILED`
- `token`: token fijo de conciliación (ejemplo: `LANGFORD_PSE_TOKEN`)

---

## Cómo conectarlo en la app (import)
1. Publica cada hoja como CSV (Archivo -> Compartir/Publicar en la web).
2. En Admin > **Sheets Backend Sync** pega las URLs CSV y usa:
   - `Importar cursos`
   - `Importar usuarios`
   - `Importar contenido`

> También puedes dejar `VITE_COURSES_SHEET_URL` para carga automática de cursos al iniciar.

## Cómo subir datos desde la web a Sheets (push)
Google Sheets no acepta escritura directa sin autenticación. Usa un backend intermedio:
- Opción recomendada: **Google Apps Script Web App** o backend propio.
- En Admin pega:
  - `Webhook URL`
  - `Token de sincronización`
- Pulsa **Enviar snapshot a Sheets backend**.

El payload incluye: `users`, `courses`, `payments`, `certificates`, `siteContent`, `generatedAt`.
