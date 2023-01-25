This is an ongoing project for Laurel Public Schools and I will be updating the documentation as we go. 

---

## Project Goal

The goal with this project is to build a scalable RDS server for students to be able to remote into from their chromebooks, allowing us to cut down on computer labs
outside of the classes that use Photoshop and Illustrator.

---

## Progress

### Initial Stages

Currently, we are building all on prem, testing with 3 windows server vms, 1 to run the gateway and licensing, the connection broker, and the session host. Once we have a proof of concept and the plan gets approved, the hope is to integrate a kubernetese cluster to scale this out. 