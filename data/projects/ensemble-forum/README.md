# Ensemble Forum

Ensemble Forum is an education-centred web forum designed to streamline the
process of getting from question to answer for teachers and students alike. It
was my capstone project for [UNSW's COMP3900 course](https://www.handbook.unsw.edu.au/undergraduate/courses/2022/COMP3900/?year=2022).
I completed it as part of a team of 5, where I was the lead backend developer.

We employed Agile development practices throughout the development cycle of
Ensemble through the use of scrum, which allowed us to design and build the app
with both flexibility and structure.

Together, we built an online forum with a focus on powerful question management
features. We designed our entire workflow around tutor and student ergonomics,
using our experience as UNSW tutors to identify issues with existing software
and design robust solutions to address them.

The result is a powerful question management system, where tutors can
categorise and respond to questions with ease. Some of our proudest features
are:

* Question queues, which allow tutors to delegate questions for others to
  answer.
* User-friendly moderation tools, allowing students to report posts and
  comments, and allowing staff to remove or hide them.
* An advanced permission system, where admins can defined custom roles, giving
  different forum members precise permissions to suit their needs.
* A customisable authentication system, capable of integrating with UNSW's
  auth servers. This boosted security, as it allowed our database to have zero
  knowledge of user passwords.

As well as the advanced and unique features we implemented, I am also extremely
proud of some of the development prowess we demonstrated in the project.

* Our backend had 99% code coverage, due to an exceptionally thorough suite of
  unit tests.
* Our entire project was type-safe, from the database to the UI. We used
  TypeScript on the front-end and typed Python on the backend, as well as a
  type-safe ORM (Piccolo) to access the database.
* Our API includes automatically-generated documentation, which increased
  developer productivity, as the API's usage and specification was clearly
  shown.
