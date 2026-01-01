# StrengthUp 🏋️‍♀️

StreghthUp, una aplicación para registrar tus entrenamientos del gimnasio de manera sencilla y eficaz, con la que podrás ver tus avances a lo largo del tiempo mediante un indicadores.

## Stack

![supabase](https://shields.io/badge/supabase-black?logo=supabase&style=for-the-badge)
![react native](https://shields.io/badge/react%20native-black?logo=react&style=for-the-badge)
![Postgres](https://img.shields.io/badge/PostgreSQL-black?logo=postgresql&style=for-the-badge&logoColor=white)
![expo](https://img.shields.io/badge/Expo-black?logo=Expo&logoColor=white&style=for-the-badge)
![typescript](https://img.shields.io/badge/TypeScript-black?style=for-the-badge&logo=typescript)
![revenuecat](https://img.shields.io/badge/RevenueCat-black?style=for-the-badge&logo=revenuecat)

![image](.images/mockup.png)

## Modelo relacional de base de datos 📏

![entidad-relacion](.images/strengthUp-relations.jpg)

## Estructura del proyecto 📂

```bash
app
├── (auth)
│   └── signup.tsx
├── +not-found.tsx
├── _layout.tsx
├── hour-training.tsx
├── index.tsx
├── list-exercises.tsx
├── personal
│   ├── (routines)
│   │   ├── _layout.tsx
│   │   ├── exercise
│   │   │   └── [...exercise].tsx
│   │   ├── history
│   │   │   └── [history].tsx
│   │   ├── index.tsx
│   │   ├── new-routine.tsx
│   │   ├── new-workout-session.tsx
│   │   ├── routine
│   │   │   └── [...routine].tsx
│   │   └── workout
│   │       └── [...workout].tsx
│   ├── (settings)
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   └── stateSub.tsx
│   └── _layout.tsx
└── scanner-routine.tsx
```

## Instalación para desarrollo 🚀

1. Instalar dependencias

   ```bash
   npm install
   ```

2. Compilación de desarrollo local (local development build)

   ```bash
    npx expo run:android
   ```

   Para correr la app en android, deberá tener el android studio

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)
