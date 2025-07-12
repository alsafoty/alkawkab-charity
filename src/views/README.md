# Views Organization

This directory contains all the view components of the application, organized by feature modules:

## Directory Structure

```
src/
├── views/
│   ├── assistance/       # Assistance management views
│   │   ├── AddAssistance.vue
│   │   ├── EditAssistance.vue
│   │   ├── ViewAssistance.vue
│   │   └── AssistanceView.vue
│   ├── family/          # Family management views
│   │   ├── AddFamily.vue
│   │   ├── EditFamily.vue
│   │   ├── ViewFamily.vue
│   │   └── FamilyView.vue
│   ├── person/          # Person management views
│   │   ├── AddPerson.vue
│   │   ├── EditPerson.vue
│   │   ├── ViewPerson.vue
│   │   └── IndividualView.vue
│   ├── admin/           # Admin related views
│   │   ├── AdminView.vue
│   │   └── EnterDB.vue
│   └── general/         # General views
│       ├── HomeView.vue
│       ├── AboutView.vue
│       └── contact-us.vue
```

## Features

- **Assistance Management**: Views for managing assistance records
- **Family Management**: Views for managing family records
- **Person Management**: Views for managing individual records
- **Admin**: Administrative views and database management
- **General**: Common views like home, about, and contact

## Best Practices

1. Each feature module is isolated in its own directory
2. Related views are grouped together
3. Consistent naming conventions
4. Clear separation of concerns