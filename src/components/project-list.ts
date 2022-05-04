import { autobind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop.interfaces";
import { Project, ProjectStatus } from "../models/project";
import { projectState } from "../state/project-state";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    projectState.addListener((projects: Project[]) => {
      const relevantProject = projects.filter(project => {
        if(this.type === 'active'){
          return project.status === ProjectStatus.Active
        }
        return project.status === ProjectStatus.Finished
      })
      this.assignedProjects = relevantProject;

      this.configure();
      this.renderProjects();
    });
    
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    
    if (event.dataTransfer! && event.dataTransfer!.types[0] === 'text/plain') {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
    
  }

  @autobind
  dropHandler(event: DragEvent): void {
    event.preventDefault();
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(projectId, 
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @autobind
  dragLeaveHandler(event: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
    console.log(event)
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';

    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
    }
  }
}
