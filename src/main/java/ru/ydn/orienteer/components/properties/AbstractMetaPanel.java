package ru.ydn.orienteer.components.properties;

import java.io.Serializable;

import org.apache.wicket.Component;
import org.apache.wicket.markup.IMarkupFragment;
import org.apache.wicket.markup.html.form.ILabelProvider;
import org.apache.wicket.markup.html.form.LabeledWebMarkupContainer;
import org.apache.wicket.model.IModel;
import org.apache.wicket.util.lang.Objects;

import ru.ydn.orienteer.services.IMarkupProvider;

import com.google.inject.Inject;

public abstract class AbstractMetaPanel<T, C, V> extends AbstractEntityAndPropertyAwarePanel<T, C, V> implements ILabelProvider<String>
{


	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final String PANEL_ID = "panel";
	
	private Serializable stateSignature;
	
	private IModel<String> labelModel;
	
	@Inject
	private IMarkupProvider markupProvider;
	
	
	
	public AbstractMetaPanel(String id, IModel<T> entityModel,
			IModel<C> propertyModel, IModel<V> valueModel)
	{
		super(id, entityModel, propertyModel, valueModel);
	}

	public AbstractMetaPanel(String id, IModel<T> entityModel,
			IModel<C> propertyModel)
	{
		super(id, entityModel, propertyModel);
	}

	@Override
	protected void onConfigure() {
		super.onConfigure();
		
		C critery = getPropertyObject();
		Serializable newSignature = getSignature(critery);
		if(!newSignature.equals(stateSignature) || get(PANEL_ID)==null)
		{
			stateSignature = newSignature;
			Component component = resolveComponent(PANEL_ID, critery);
			if(component instanceof LabeledWebMarkupContainer)
			{
				((LabeledWebMarkupContainer)component).setLabel(getLabel());
			}
			addOrReplace(component);
		}
	}
	
	protected Serializable getSignature(C critery)
	{
		return Objects.hashCode(critery);
	}
	
	@Override
	public IMarkupFragment getMarkup(Component child) {
		if(child==null) return super.getMarkup(child);
		IMarkupFragment ret = markupProvider.provideMarkup(child);
		return ret!=null?ret:super.getMarkup(child);
	}
	
	@Override
	public IModel<String> getLabel() {
		if(labelModel==null)
		{
			labelModel = newLabelModel();
		}
		return labelModel;
	}

	protected abstract IModel<String> newLabelModel();
	protected abstract Component resolveComponent(String id, C critery);
	
}